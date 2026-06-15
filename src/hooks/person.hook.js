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
 */
export function usePerson() {
	const service = usePersonService();

	/**
	 * Retrieve paginated people list.
	 *
	 * @type {(options: {
	 *   page: number,
	 *   limit: number,
	 *   sortBy: string,
	 *   descending: boolean,
	 * }) => {
	 *   data: Realm.Results<PersonModelNonSerializable>,
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
	 * @type {(id: string|BSON.UUID, withTrashed: boolean) => ?UserModelNonSerializable}
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
 */
export function usePersonActions() {
	const service = usePersonService();

	const store = useStore();

	const { t } = useTranslation();

	/**
	 * Create a new person.
	 * 
	 * @type {(data: PersonModelFormData, options: {
	 *   processCode: ?string,
	 *   autoState: boolean,
	 *   onConcurrent: ((number_of_pending_processes: number) => void) | null,
	 * }) => Promise<PersonModelNonSerializable>}
	 */
	const createPerson = useCallback(
		async function(data, {
			processCode = null,
			autoState = true,
			onConcurrent = null
		} = {}) {
			const code = processCode ?? uuid.v4();

			return await executeProcess(
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
	 * @type {(person: PersonModelNonSerializable, options: {
	 *   processCode: ?string,
	 *   autoState: boolean,
	 *   onConcurrent: ((number_of_pending_processes: number) => void) | null,
	 * }) => Promise<boolean>}
	 */
	const deletePerson = useCallback(
		async function(person, {
			processCode = null,
			autoState = true,
			onConcurrent = null
		} = {}) {
			const code = processCode ?? uuid.v4();

			return await executeProcess(
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
