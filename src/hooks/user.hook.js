import { useCallback, useMemo } from "react";
import { useRealm } from "@realm/react";
import uuid from 'react-native-uuid'

import { UserService } from "../services/UserService";
import { countUserPendingProcess, getUserProcess } from "../store/features/users/users.selector";
import { useDispatch, useStore } from "react-redux";
import { ToastAndroid } from "react-native";
import { useTranslation } from "react-i18next";
import { addUserProcess, setUserProcess } from "../store/features/users/users.slice";
import { executeProcess } from "../utils/helpers";
import { mapErrorToMessage } from "../utils/errorMapper";
import { EmailAlreadyExistsError, UsernameAlreadyExistsError, UserNotExistsError } from "../database/errors/users.exception";

/**
 * User service hook.
 *
 * Creates and memoizes the service layer
 * with its repository dependencies.
 *
 * Flow:
 * UI -> Hooks -> Service -> Repository -> Realm
 *
 * @returns {UserService}
 */
export function useUserService() {
	const realm = useRealm();

	return useMemo(() => {
		return new UserService(realm);
	}, [realm]);
}

/**
 * User read hook.
 *
 * Handles all read operations related
 * to users.
 *
 * This hook should only expose
 * retrieval/query methods.
 *
 * @returns {{
 *   getUsers: Function,
 *   getUser: Function
 * }}
 */
export function useUser() {
	const service = useUserService();

	/**
	 * Retrieve paginated user list.
	 *
	 * @param {Object} options
	 * @param {number} [options.page=1]
	 * @param {number} [options.limit=20]
	 * @param {string} [options.sortBy="updatedAt"]
	 * @param {boolean} [options.descending=false]
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
	const getUsers = useCallback(
		(options) => {
			return service.getUsers(options)
		},
		[service]
	)

	/**
	 * Retrieve single user by identifier.
	 *
	 * @param {string|BSON.UUID} id
	 * @param {boolean} withTrashed
	 *
	 * @returns {User|null}
	 */
	const getUser = useCallback(
		(id, withTrashed = false) => {
			return service.getUser(id, withTrashed)
		},
		[service]
	)

	return {
		getUsers,
		getUser,
	};
}

/**
 * User actions hook.
 *
 * Handles all write operations related
 * to users.
 *
 * This hook should only expose
 * mutation/action methods.
 *
 * @returns {{
 *   createUser: Function,
 *   deleteUser: Function
 * }}
 */
export function useUserActions() {
	const service = useUserService();

	const store = useStore();

	const { t } = useTranslation();

	/**
	 * Create a new user.
	 *
	 * @param {Object} data - User payload.
	 * @param {Object} [options={}] - Creation options.
	 * @param {?string} [options.processCode=null] - Optional process identifier used to track the operation.
	 * @param {boolean} [options.autoState=true] - Automatically manages loading and process states.
	 * @param {?Function} [options.onConcurrent=null] - Callback invoked when another creation process is already in progress.
	 *
	 * @returns {User}
	 */
	const createUser = useCallback(
		(data, {
			processCode = null,
			autoState = true,
			onConcurrent = null
		} = {}) => {
			const code = processCode ?? uuid.v4();
			const results = executeProcess(() => {
					try {
						let user = null;

						service.realm.write(() => {
							user = service.createUser(data)
						})

						return user;
					} catch (error) {

						if(
							error instanceof UsernameAlreadyExistsError ||
							error instanceof EmailAlreadyExistsError
						)
							error.message = mapErrorToMessage(error, t);

						throw error;
					}
				},
				{
					store,
					countProcess: countUserPendingProcess,
					code,
					autoState,
					onConcurrent,
					addProcess: addUserProcess,
					setProcess: setUserProcess,
					actionType: "user/hook/createUser",
					concurrentMessage: "errors:users.create.concurrent",
					t,
				}
			);

			return results;
		},
		[service]
	);

	/**
	 * Delete user.
	 *
	 * Performs soft delete if supported,
	 * otherwise performs permanent deletion.
	 *
	 * @param {User} user
	 *
	 * @returns {boolean}
	 */
	const deleteUser = useCallback(
		(user, {
			processCode = null,
			autoState = true,
			onConcurrent = null
		} = {}) => {
			const code = processCode ?? uuid.v4();

			return executeProcess(() => {
					try {
						let deleted = false;

						service.realm.write(() => {
							deleted = service.deleteUser(user);
						});

						return deleted;
					} catch (error) {

						if(error instanceof UserNotExistsError)
							error.message = mapErrorToMessage(error, t);

						throw error;
					}
				},
				{
					store,
					countProcess: countUserPendingProcess,
					code,
					autoState,
					onConcurrent,
					addProcess: addUserProcess,
					setProcess: setUserProcess,
					actionType: "user/hook/deleteUser",
					concurrentMessage: "errors:users.delete.concurrent",
					t,
				}
			);
		},
		[service]
	);

	return {
		createUser,
		deleteUser,
	};
}