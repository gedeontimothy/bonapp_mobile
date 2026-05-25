import { BSON } from "realm";

export class PersonRepository {
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
	 * @returns {PersonRepository}
	 */
	static instance(realm){
		return new PersonRepository(realm);
	}

	/**
	 * Retrieve all non-deleted persons.
	 *
	 * @returns {Realm.Results<Person>}
	 */
	getAll(withTrash = false) {
		const personQuery = this.realm.objects("Person");
		return withTrash ? personQuery : personQuery
			.filtered("deletedAt == null")
		;
	}

	/**
	 * Retrieve paginated persons list.
	 *
	 * @param {Object} options
	 * @param {number} [options.page=1] - Current page number.
	 * @param {number} [options.limit=20] - Number of items per page.
	 * @param {string} [options.sortBy="updatedAt"] - Field used for sorting.
	 * @param {boolean} [options.descending=false] - Sort descending order.
	 * @param {boolean} [options.withTrash=false] - With deleted people.
	 *
	 * @returns {{
	 *   data: Realm.Results<Person>,
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
	 * Find person by primary key.
	 *
	 * @param {BSON.UUID|string} id - Person identifier.
	 * @param {boolean} withTrashed - With trashed person.
	 * @returns {Person|null}
	 */
	findById(id, withTrashed = false) {
		const person = this.realm.objectForPrimaryKey(
			"Person",
			new BSON.UUID(id)
		);
		return withTrashed || person?.deletedAt == null ? person : null;
	}

	/**
	 * Create new person.
	 *
	 * @param {Object} data
	 * @param {string} data.firstname
	 * @param {string} data.lastname
	 * @param {string|null} [data.middlename]
	 * @param {string} data.gender
	 *
	 * @returns {Person}
	 */
	create(data) {
		return this.realm.create("Person", {
			_id: new BSON.UUID(),
			createdAt: new Date(),
			updatedAt: new Date(),
			...data,
		});
	}

	/**
	 * Update existing person.
	 *
	 * @param {Person} person - Person instance to update.
	 * @param {Object} patch - Partial data to update.
	 *
	 * @returns {Person}
	 */
	update(person, patch) {
		Object.assign(person, {
			...patch,
			updatedAt: new Date(),
		});

		return person;
	}

	/**
	 * Delete person.
	 *
	 * @param {Person} person - Person instance.
	 *
	 * @returns {boolean}
	 */
	delete(person) {
		this.update(person, {
			deletedAt: new Date(),
			updatedAt: new Date(),
		})

		return true;
	}

	/**
	 * Permanently delete person from database.
	 *
	 * @param {Person} person - Person instance.
	 *
	 * @returns {boolean}
	 */
	destroy(person) {
		this.realm.delete(person);

		return true;
	}
}