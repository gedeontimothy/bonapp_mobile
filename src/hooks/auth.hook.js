import { useDispatch, useSelector, useStore } from "react-redux";
import uuid from 'react-native-uuid';

import { User } from "../database/models/User";
import { authOnProcessing as authOnProcessingSelector, getAuthProcess, isAuth as isAuthSelector, profile as profileSelector, profileExists, authUser as authUserSelector, authProfile as authProfileSelector, profile, countAuthPendingProcess } from "../store/features/auth/auth.selector";
import { useUser, useUserActions } from "./user.hook";
import { useTranslation } from "react-i18next";
import { checkPinCode, executeProcess } from "../utils/helpers";
import { addAuthProcess, authenticate as authenticateAction, initUserProfile, loadUserProfile, logout as logoutAction, setAuthProcess, deleteProfile as deleteProfileAction } from "../store/features/auth/auth.slice";
import UserMapper from "../database/mappers/UserMapper";
import { processColor } from "react-native";
import { getUserProcess } from "../store/features/users/users.selector";


/**
 * Auth hook.
 */
export const useAuth = () => {

	const { t } = useTranslation();

	const dispatch = useDispatch();

	const store = useStore();

	const { getUserByUsername, getUser } = useUser();

	const { deleteUser } = useUserActions();

	/**
	 * Authentication is pending.
	 *
	 * @var {boolean}
	 */
	const authOnProcessing = useSelector(authOnProcessingSelector);

	/**
	 * Authenticated user.
	 * 
	 * @var {Object}
	 */
	const authUser = useSelector(authUserSelector);

	/**
	 * Retrieves profile of authenticated user.
	 * 
	 * @var {{
	 *   user: Object,
	 *   preferences: Object
	 * } | null}
	 */
	const authProfile = useSelector(authProfileSelector);

	/**
	 * Check if user is authenticate.
	 *
	 * @var {boolean}
	 */
	const isAuth = useSelector(isAuthSelector);

	/**
	 * Authenticate user.
	 *
	 * @param {string} username
	 * @param {string} pin
	 * @param {Object} [options={}]
	 * @param {string} [options.processCode=null]
	 * @param {boolean} [options.autoState=true]
	 * 
	 * @returns {Promise<string|boolean>}
	 */
	const authenticate = async (
		username,
		pin,
		{
			withProfile=false,
			processCode = null,
			autoState = true,
		} = {}
	) => {
		const user = getUserByUsername(username);

		const profile_ = profileSelector(user?._id ?? '')(store.getState());

		if(
			user == null ||
			(
				(withProfile && profile_ && !profile_.preferences.loginWithoutPin) ||
				(
					(
						!withProfile ||
						(
							(profile_ && !profile_.preferences.loginWithoutPin) ||
							profile_ == null
						)
					) &&
					!checkPinCode(pin, user.pin)
				)
			)
		) return t('errors:auth.failed');

		const code = processCode ?? uuid.v4();

		await dispatch(authenticateAction({
			user: UserMapper.toDTO(user),
			processCode: code,
			autoState,
		}));

		const process = getAuthProcess(code)(store.getState())

		if(process.error)
			return process.error;

		return true;
	}

	/**
	 * Logout user account.
	 * 
	 * @param {Object} [options={}]
	 * @param {string} [options.processCode=null]
	 * @param {boolean} [options.autoState=true]
	 *
	 * @returns {Promise<string|boolean>}
	 */
	const logout = async ({processCode = null, autoState = true} = {}) => {
		if(isAuth){
			const code = processCode ?? uuid.v4();

			await dispatch(logoutAction({processCode: code, autoState}));

			const process = getAuthProcess(code)(store.getState())

			if(process.error)
				return process.error;

			return true;
		}
		return false;
	}

	/**
	 * Switch between user.
	 * 
	 * @param {Object} arg 
	 * @param {string} arg.userId 
	 * @param {?string} [arg.pin=null]
	 * @param {{
	 *   processCode: string,
	 *   processState: string,
	 *   autoState: boolean,
	 * }} [options={}] 
	 * @returns {Promise<string | boolean>}
	 */
	const switchUser = async function(
		{userId, pin=null},
		options={}
	){
		const {processCode=null, processState='pending', autoState=true} = options ?? {};

		const code = processCode ?? uuid.v4();

		dispatch(addAuthProcess({
			code,
			actionType: "auth/hook/switchUser",
			processState,
		}));

		const current_user = authUser ?? null;

		let error_message = null;

		if(current_user == null || current_user._id != userId){
			const profile = profileSelector(userId)(store.getState());
			
			const user = profile ? getUserByUsername(profile.user.username) : null;

			if(
				user &&
				profile &&
				(
					profile.preferences.loginWithoutPin ||
					(pin && checkPinCode(pin, user.pin))
				)
			){
				const auth_code = uuid.v4();

				await dispatch(authenticateAction({
					user: UserMapper.toDTO(user),
					processCode: auth_code,
				}));

				const auth_process = getAuthProcess(auth_code)(store.getState())

				if(auth_process.error){
					dispatch(setAuthProcess({
						code,
						error: auth_process.error,
						...(autoState ? {processState: "rejected"} : {})
					}))

					return auth_process.error;
				}

				if(autoState){
					dispatch(setAuthProcess({
						code, processState: "fulfilled"
					}));
				}

				return true;
			}
			// else if(!profile_exists) destroyUserByUsername

			error_message = t('errors:auth.failed');

		}

		if(error_message === null) 
			error_message = t("errors:auth.alreadyAuthenticated");

		dispatch(setAuthProcess({
			code,
			error: error_message,
			...(autoState ? {processState: "rejected"} : {})
		}))

		return error_message;

	}

	/**
	 * Delete user profile.
	 * 
	 * @param {Object} arg
	 * @param {string} [arg.userId]
	 * @param {?string} [arg.pin=null]
	 * @param {boolean} [arg.force=false]
	 * @param {{
	 *   processCode: string,
	 *   processState: string,
	 *   autoState: boolean,
	 * }} options
	 * 
	 * @returns {Promise<{error: Object | boolean, message: string} | boolean>}
	 */
	const deleteProfile = async function(
		{
			userId,
			pin=null,
			force=false
		},
		options={}
	) {
		const {processCode, processState="pending", autoState=true} = options ?? {};

		const code = processCode ?? uuid.v4();

		if(code) dispatch(addAuthProcess({
			code,
			actionType: "auth/hook/deleteProfile",
			processState,
		}));

		const _profile = profile(userId)(store.getState());

		let error_message = null;


		if(_profile){
			const user = getUser(userId);

			error_message = !isAuth && !user
				? t("errors:users.account.notExists")
				: (!isAuth && user && (pin == null || !checkPinCode(pin, user.pin))
					? t("common:errors.auth.invalidPassword")
					: (!force && isAuth && authUser._id == userId
						? t("errors:profiles.delete.currentUserProfile")
						: null
					)
				)
			;

			if(error_message){
				dispatch(setAuthProcess({
					code,
					error: error_message,
					...(autoState ? {processState: "rejected"} :{})
				}))

				console.warn("hook/useAuth/deleteProfile", error_message);
				return {error: true, message: error_message};
			}

			const delete_profile_process_code = uuid.v4();

			await dispatch(deleteProfileAction({
				userId,
				process: {processCode: delete_profile_process_code}
			}));

			const delete_profile_process = getAuthProcess(delete_profile_process_code)(store.getState())

			if(delete_profile_process?.error){
				dispatch(setAuthProcess({
					code,
					error: delete_profile_process.error,
					...(autoState ? {processState: "rejected"} :{})
				}))

				console.warn("hook/useAuth/deleteProfile", delete_profile_process.error);
				return {error:true, message: delete_profile_process.error};
			}

			if(autoState) dispatch(setAuthProcess({
				code,
				processState: "fulfilled",
			}))

			return true;
		}

		error_message = t("errors:profiles.notExists");

		if(code) dispatch(setAuthProcess({
			code,
			error: error_message,
			...(autoState ? {processState: "rejected"} : {})
		}));

		console.warn("hook/useAuth/deleteProfile", error_message);
		return {error: true, message: error_message};
	}

	/**
	 * Delete an account.
	 * 
	 * @param {Object} arg
	 * @param {string} arg.userId
	 * @param {string} arg.pin
	 * @param {boolean} [arg.forceDeleteProfile=false]
	 * @param {{
	 *   processCode: string,
	 *   processState: string,
	 *   autoState: boolean,
	 * }} options
	 * @returns {Promise<{error: boolean | Object, isConcurrent: boolean, message: string, data: any}>}
	 */
	const deleteAccount = async function(
		{
			userId,
			pin,
			forceDeleteProfile = false,
		},
		options={}
	){
		const {processCode, processState="pending", autoState=true} = options ?? {};
		
		const code = processCode ?? uuid.v4();
		
		return await executeProcess(
			async ({errorProcess}) => {
				const _user = getUser(userId);

				let error_message = null;

				if(!checkPinCode(pin, _user.pin)){
					error_message = t("errors:auth.invalidPassword");

					errorProcess(error_message);

					console.warn("auth/hook/deleteAccount", error_message);

					return error_message;
				}

				if(_user){

					const deletion_user_process_code = uuid.v4();

					await deleteUser(_user, {processCode: deletion_user_process_code});

					const deletion_user_process = getUserProcess(deletion_user_process_code)(store.getState());

					if(deletion_user_process?.error){
						errorProcess(deletion_user_process.error);

						console.warn("auth/hook/deleteAccount", deletion_user_process.error);

						return deletion_user_process.error;
					}

					if(authUser._id != userId || (await logout()) === true)
						await deleteProfile({userId, pin, force: forceDeleteProfile})

					return true;
				}

				error_message = t("errors:users.account.notExists");

				errorProcess(error_message);

				console.warn("auth/hook/deleteAccount", error_message);

				return error_message;
			},
			{
				countProcess: countAuthPendingProcess,
				addProcess: addAuthProcess,
				setProcess: setAuthProcess,
				t,
				store,
				code,
				actionType: "auth/hook/deleteAccount",
				autoState,
				processState,
				safeReturn: true,
			}
		);

	}

	/**
	 * Delete authenticated account.
	 * 
	 * @param {string} pin 
	 * @param {{
	 *   processCode: string,
	 *   processState: string,
	 *   autoState: boolean,
	 * }} [options={}]
	 * @returns {Promise<
	 *   {error: boolean, message: string} |
	 *   {error: boolean | Object, isConcurrent: boolean, message: string, data: any}
	 * >}
	 */
	const deleteAuthAccount = async (pin, options={}) => {
		if(isAuth)
			return await deleteAccount({userId: authUser._id, pin, forceDeleteProfile: true}, options);

		return {error:true, message: t("errors:auth.notAuthenticated")};
	};

	return {
		authenticate,
		logout,
		switchUser,
		deleteProfile,
		deleteAccount,
		deleteAuthAccount,
		
		/**
		 * Authentication is pending.
		 */
		authOnProcessing,

		/**
		 * Check if user is authenticate.
		 */
		isAuth,

		/**
		 * Authenticated user.
		 */
		authUser,

		/**
		 * Retrieves profile of authenticated user.
		 */
		authProfile,
	};

}