import { User } from "../database/models/User";
import { UserRepository } from "../database/repositories/user.repository";
import { PersonRepository } from "../database/repositories/person.repository";
import { EmailAlreadyExistsError, UsernameAlreadyExistsError, UserNotExistsError } from "../database/errors/users.exception";
import { is_string } from "../utils/check";
import { email } from "zod/v4-mini";
import { SHA256 } from "crypto-js";
import { checkPinCode, hash } from "../utils/helpers";

export class UserService {

	/**
	 * Service constructor.
	 *
	 * @param {Realm} realm
	 */
	constructor(realm) {
		this.realm = realm;

		this.repository = new UserRepository(this.realm);
		this.personRepository = new PersonRepository(this.realm);
	}

	/**
	 * Create new user.
	 *
	 * @param {TFormCreateUser} data
	 *
	 * @returns {UserModelNonSerializable}
	 * 
	 * @throws {UsernameAlreadyExistsError}
	 * @throws {EmailAlreadyExistsError}
	 */
	createUser(data) {
		if(this.repository.findByUsername(data.userData.username, true))
			throw new UsernameAlreadyExistsError(data.userData.username);

		if(is_string(data?.userData?.email) && this.repository.findByEmail(data.userData.email, true))
			throw new EmailAlreadyExistsError(data.userData.email);

		const person = this.personRepository.create(data.personData);

		return this.repository.create({
			...data.userData,
			pin: hash(data.userData.pin),
			person: {
				displayName: `${person.firstname} ${person.lastname}`,
				firstname: person.firstname,
				lastname: person.lastname,
				gender: person?.gender,
			},
			personId: person._id,
		});
	}

	/**
	 * Authenticate user with username and pin code.
	 * 
	 * @param {string} username 
	 * @param {string} pin 
	 * @returns {?UserModelNonSerializable}
	 */
	authenticate(username, pin) {
		const user = this.getUserByUsername(username);

		if(user == null)
			throw new Error("Username not found.");

		if(!checkPinCode(pin, user.pin))
			throw new Error("PIN is not correct.");

		return user;

	}

	/**
	 * Retrieve user by identifier.
	 *
	 * @param {string|BSON.UUID} id - User identifier.
	 * @param {boolean} withTrashed - With trashed user.
	 *
	 * @returns {?UserModelNonSerializable}
	 */
	getUser(id, withTrashed = false) {
		return this.repository.findById(id, withTrashed);
	}

	/**
	 * Get user by username.
	 *
	 * @param {string} username
	 * @param {boolean} withTrashed - With trashed user.
	 * @returns {?UserModelNonSerializable}
	 */
	getUserByUsername(username, withTrashed = false) {
		return this.repository.findByUsername(username, withTrashed);
	}

	/**
	 * Retrieve paginated users list.
	 *
	 * @param {Object} options
	 * @param {number} [options.page=1]
	 * @param {number} [options.limit=20]
	 * @param {string} [options.sortBy="updatedAt"]
	 * @param {boolean} [options.descending=false]
	 *
	 * @returns {{
	 *   data: Realm.Results<UserModelNonSerializable>,
	 *   total: number,
	 *   page: number,
	 *   limit: number,
	 *   hasNextPage: boolean,
	 *   hasPrevPage: boolean
	 * }}
	 */
	getUsers(options) {
		return this.repository.getAllPaginate(options);
	}

	/**
	 * Retrieve users list.
	 * 
	 * @param {boolean} withTrash 
	 * @returns {Array<UserModelNonSerializable>}
	 */
	getAllUser(withTrash = false) {
		return this.repository.getAll(withTrash);
	}

	/**
	 * Soft delete user if supported,
	 * otherwise permanently deletes it.
	 *
	 * @param {UserModelNonSerializable} user
	 *
	 * @returns {boolean}
	 */
	deleteUser(user) {
		if(this.repository.findById(user._id) == null)
			throw new UserNotExistsError();

		return this.repository.delete(user);
	}

	/**
	 * Permanently delete user.
	 *
	 * @param {UserModelNonSerializable} user
	 *
	 * @returns {boolean}
	 */
	forceDeleteUser(user) {
		if(this.repository.findById(user._id) == null)
			throw new UserNotExistsError();

		return this.repository.destroy(user);
	}
}
