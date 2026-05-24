import { useCallback, useMemo } from "react";
import { useRealm } from "@realm/react";
import uuid from 'react-native-uuid'

import { PersonRepository } from "../database/repositories/person.repository";
import { PersonService } from "../services/PersonService";
import { countPersonPendingProcess } from "../store/features/process/process.selector";
import { useDispatch, useStore } from "react-redux";
import { ToastAndroid } from "react-native";
import { useTranslation } from "react-i18next";
import { addPersonProcess, setPersonProcess } from "../store/features/process/process.slice";
import { executeProcess } from "../utils/helpers";

/**
 * Person service hook.
 *
 * Creates and memoizes the service layer
 * with its repository dependencies.
 *
 * Flow:
 * UI -> Hooks -> Service -> Repository -> Realm
 *
 * @returns {PersonService}
 */
export function usePersonService() {
	const realm = useRealm();

	return useMemo(() => {
		const repository = new PersonRepository(realm);

		return new PersonService(repository);
	}, [realm]);
}

/**
 * Person read hook.
 *
 * Handles all read operations related
 * to persons.
 *
 * This hook should only expose
 * retrieval/query methods.
 *
 * @returns {{
 *   getPeople: Function,
 *   getPerson: Function
 * }}
 */
export function usePerson() {
	const service = usePersonService();

	/**
	 * Retrieve paginated people list.
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
	const getPeople = useCallback(
		(options) => {
			return service.getPeople(options)
		},
		[service]
	)

	/**
	 * Retrieve single person by identifier.
	 *
	 * @param {string|BSON.UUID} id
	 * @param {boolean} withTrashed
	 *
	 * @returns {Person|null}
	 */
	const getPerson = useCallback(
		(id, withTrashed = false) => {
			return service.getPerson(id, withTrashed)
		},
		[service]
	)

	return {
		getPeople,
		getPerson,
	};
}

/**
 * Person actions hook.
 *
 * Handles all write operations related
 * to persons.
 *
 * This hook should only expose
 * mutation/action methods.
 *
 * @returns {{
 *   createPerson: Function,
 *   deletePerson: Function
 * }}
 */
export function usePersonActions() {
	const service = usePersonService();

	const store = useStore();

	const { t } = useTranslation();

	/**
	 * Create a new person.
	 *
	 * @param {Object} data - Person payload.
	 * @param {Object} [options={}] - Creation options.
	 * @param {?string} [options.processCode=null] - Optional process identifier used to track the operation.
	 * @param {boolean} [options.autoState=true] - Automatically manages loading and process states.
	 * @param {?Function} [options.onConcurrent=null] - Callback invoked when another creation process is already in progress.
	 *
	 * @returns {Person}
	 */
	const createPerson = useCallback(
		(data, {
			processCode = null,
			autoState = true,
			onConcurrent = null
		} = {}) => {
			const code = processCode ?? uuid.v4();

			return executeProcess(
				() => {
					let person = null;

					service.repository.realm.write(() => {
						person = service.createPerson(data);
					})

					return person;
				},
				{
					store,
					countProcess: countPersonPendingProcess,
					code,
					autoState,
					onConcurrent,
					addProcess: addPersonProcess,
					setProcess: setPersonProcess,
					actionType: "people/hook/createPerson",
					concurrentMessage: "errors:people.create.concurrent",
					t,
				}
			);
		},
		[service]
	);

	/**
	 * Delete person.
	 *
	 * Performs soft delete if supported,
	 * otherwise performs permanent deletion.
	 *
	 * @param {Person} person
	 *
	 * @returns {boolean}
	 */
	const deletePerson = useCallback(
		(person, {
			processCode = null,
			autoState = true,
			onConcurrent = null
		} = {}) => {
			const code = processCode ?? uuid.v4();

			return executeProcess(
				() => {
					let deleted = false;

					service.realm.write(() => {
						deleted = service.deletePerson(person)
					});

					return deleted
				},
				{
					store,
					countProcess: countPersonPendingProcess,
					code,
					autoState,
					onConcurrent,
					addProcess: addPersonProcess,
					setProcess: setPersonProcess,
					actionType: "people/hook/deletePerson",
					concurrentMessage: "errors:people.delete.concurrent",
					t,
				}
			);
		},
		[service]
	);

	return {
		createPerson,
		deletePerson,
	};
}