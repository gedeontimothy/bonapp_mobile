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
	 * @param {Object} data
	 * @param {string} data.firstname
	 * @param {string} data.lastname
	 * @param {string|null} [data.middlename]
	 * @param {string} data.gender
	 *
	 * @returns {Person}
	 */
	createPerson(data) {
		return this.repository.create(data);
	}

	/**
	 * Retrieve person by identifier.
	 *
	 * @param {string|BSON.UUID} id - Person identifier.
	 *
	 * @returns {Person|null}
	 */
	getPerson(id) {
		return this.repository.findById(id);
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
	 *   data: Realm.Results<Person>,
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
	 * @param {Person} person
	 *
	 * @returns {boolean}
	 */
	deletePerson(person) {
		return this.repository.delete(person);
	}

	/**
	 * Permanently delete person.
	 *
	 * @param {Person} person
	 *
	 * @returns {boolean}
	 */
	forceDeletePerson(person) {
		return this.repository.destroy(person);
	}
}