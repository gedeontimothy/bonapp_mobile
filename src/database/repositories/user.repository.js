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
	 * @returns {Realm.Results<UserModelNonSerializable>}
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
	 *   data: Realm.Results<UserModelNonSerializable>,
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
	 * @returns {?UserModelNonSerializable}
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
	 * @returns {?UserModelNonSerializable}
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
	 * @returns {?UserModelNonSerializable}
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
	 * @param {UserModelFormData} data
	 *
	 * @returns {UserModelNonSerializable}
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
	 * @param {UserModelNonSerializable} user - User instance to update.
	 * @param {UserModelFormData} patch - Partial data to update.
	 *
	 * @returns {UserModelNonSerializable}
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
	 * @param {UserModelNonSerializable} user - User instance.
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
	 * @param {UserModelNonSerializable} user - User instance.
	 *
	 * @returns {boolean}
	 */
	destroy(user) {
		this.realm.delete(user);

		return true;
	}
}
