import { BSON } from "realm";
import { User } from "../models/User";

export class UserRepository {
	/**
	 * Repository constructor.
	 *
	 * @param {Realm} realm - Realm database instance.
	 */
	constructor(realm) {
		this.realm = realm;
	}

	/**
	 * Create repository instance.
	 *
	 * @static
	 * @param {Realm} realm - Realm database instance.
	 * @returns {UserRepository}
	 */
	static instance(realm){
		return new UserRepository(realm);
	}

	/**
	 * Retrieve all non-deleted users.
	 *
	 * @returns {Realm.Results<User>}
	 */
	getAll(withTrash = false) {
		const userQuery = this.realm.objects("User");
		return withTrash ? userQuery : userQuery
			.filtered("deletedAt == null")
		;
	}

	/**
	 * Retrieve paginated users list.
	 *
	 * @param {Object} options
	 * @param {number} [options.page=1] - Current page number.
	 * @param {number} [options.limit=20] - Number of items per page.
	 * @param {string} [options.sortBy="updatedAt"] - Field used for sorting.
	 * @param {boolean} [options.descending=false] - Sort descending order.
	 * @param {boolean} [options.withTrash=false] - With deleted users.
	 *
	 * @returns {{
	 *   data: Realm.Results<User>,
	 *   total: number,
	 *   page: number,
	 *   limit: number,
	 *   hasNextPage: boolean,
	 *   hasPrevPage: boolean
	 * }}
	 */
	getAllPaginate({
		page = 1,
		limit = 20,
		sortBy = "updatedAt",
		descending = false,
		withTrash = false,
	} = {}) {
		const results = this.getAll(withTrash).sorted(
			sortBy,
			descending
		);

		const start = (page - 1) * limit;
		const end = start + limit;

		return {
			data: results.slice(start, end),
			total: results.length,
			page,
			limit,
			hasNextPage: end < results.length,
			hasPrevPage: page > 1,
		};
	}

	/**
	 * Find user by primary key.
	 *
	 * @param {BSON.UUID|string} id - User identifier.
	 * @param {boolean} withTrashed - With trashed user.
	 * @returns {User|null}
	 */
	findById(id, withTrashed = false) {
		const user = this.realm.objectForPrimaryKey(
			"User",
			new BSON.UUID(id)
		);
		return withTrashed || user?.deletedAt == null ? user : null;
	}

	/**
	 * Find user by email.
	 *
	 * @param {string} email
	 * @param {boolean} withTrashed - With trashed user.
	 * @returns {User|null}
	 */
	findByEmail(email, withTrashed = false) {
		return this.realm
			.objects('User')
			.filtered(
				"email == $0" + (withTrashed
					? ""
					: " AND deletedAt == null"
				),
				email
			)?.[0]
		?? null;
	}

	/**
	 * Find user by username.
	 *
	 * @param {string} username
	 * @param {boolean} withTrashed - With trashed user.
	 * @returns {User|null}
	 */
	findByUsername(username, withTrashed = false) {
		return this.realm
			.objects('User')
			.filtered(
				"username == $0" + (withTrashed
					? ""
					: " AND deletedAt == null"
				),
				username
			)?.[0]
		?? null;
	}

	/**
	 * Create new user.
	 *
	 * @param {Object} data
	 * @param {string} data.personId
	 * @param {Object} data.person
	 * @param {string} data.person.displayName
	 * @param {string} data.person.firstname
	 * @param {string} data.person.lastname
	 * @param {string} data.person.gender
	 * @param {string} data.username
	 * @param {string} data.pin
	 * @param {string} data.email
	 * @param {Date} data.email_verified_at
	 *
	 * @returns {User}
	 */
	create(data) {
		return this.realm.create("User", {
			_id: new BSON.UUID(),
			createdAt: new Date(),
			updatedAt: new Date(),
			...data,
		});
	}

	/**
	 * Update existing user.
	 *
	 * @param {User} user - User instance to update.
	 * @param {Object} patch - Partial data to update.
	 *
	 * @returns {User}
	 */
	update(user, patch) {
		Object.assign(user, {
			...patch,
			updatedAt: new Date(),
		});

		return user;
	}

	/**
	 * Delete user.
	 *
	 * @param {User} user - User instance.
	 *
	 * @returns {boolean}
	 */
	delete(user) {
		this.update(user, {
			deletedAt: new Date(),
			updatedAt: new Date(),
		})

		return true;
	}

	/**
	 * Permanently delete user from database.
	 *
	 * @param {User} user - User instance.
	 *
	 * @returns {boolean}
	 */
	destroy(user) {
		this.realm.delete(user);

		return true;
	}
}
