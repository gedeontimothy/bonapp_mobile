import { PersonRepository } from "../database/repositories/person.repository";

export class PersonService {

	/**
	 * Service constructor.
	 *
	 * @param {PersonRepository} repository - Person repository instance.
	 */
	constructor(repository) {
		this.repository = repository;
	}

	/**
	 * Create new person.
	 *
	 * @param {PersonModelFormData} data
	 *
	 * @returns {PersonModelNonSerializable}
	 */
	createPerson(data) {
		return this.repository.create(data);
	}

	/**
	 * Retrieve person by identifier.
	 *
	 * @param {string|BSON.UUID} id - Person identifier.
	 * @param {boolean} withTrashed - With trashed person.
	 *
	 * @returns {?PersonModelNonSerializable}
	 */
	getPerson(id, withTrashed = false) {
		return this.repository.findById(id, withTrashed);
	}

	/**
	 * Retrieve paginated persons list.
	 *
	 * @param {Object} options
	 * @param {number} [options.page=1]
	 * @param {number} [options.limit=20]
	 * @param {string} [options.sortBy="updatedAt"]
	 * @param {boolean} [options.descending=false]
	 *
	 * @returns {{
	 *   data: Realm.Results<PersonModelNonSerializable>,
	 *   total: number,
	 *   page: number,
	 *   limit: number,
	 *   hasNextPage: boolean,
	 *   hasPrevPage: boolean
	 * }}
	 */
	getPeople(options) {
		return this.repository.getAllPaginate(options);
	}

	/**
	 * Soft delete person if supported,
	 * otherwise permanently deletes it.
	 *
	 * @param {PersonModelNonSerializable} person
	 *
	 * @returns {boolean}
	 */
	deletePerson(person) {
		return this.repository.delete(person);
	}

	/**
	 * Permanently delete person.
	 *
	 * @param {PersonModelNonSerializable} person
	 *
	 * @returns {boolean}
	 */
	forceDeletePerson(person) {
		return this.repository.destroy(person);
	}
}