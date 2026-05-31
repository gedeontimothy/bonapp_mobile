import { useDispatch, useSelector, useStore } from "react-redux";
import uuid from 'react-native-uuid';

import { User } from "../database/models/User";
import { authOnProcessing as authOnProcessingSelector, getAuthProcess, isAuth as isAuthSelector } from "../store/features/auth/auth.selector";
import { useUser } from "./user.hook";
import { useTranslation } from "react-i18next";
import { checkPinCode } from "../utils/helpers";
import { authenticate as authenticateAction, logout as logoutAction } from "../store/features/auth/auth.slice";


 /**
  * Auth hook.
  *
  * @returns {{
  *   authenticate: Function,
  *   logout: Function,
  *   authOnProcessing: boolean,
  *   isAuth: boolean,
  * }}
  */
export const useAuth = () => {

	/**
	 * Authentication is pending.
	 *
	 * @var {boolean}
	 */
	const authOnProcessing = useSelector(authOnProcessingSelector);

	const { t } = useTranslation();

	const dispatch = useDispatch();

	const store = useStore();

	/**
	 * Check if user is authenticate.
	 *
	 * @returns {boolean}
	 */
	const isAuth = useSelector(isAuthSelector);

	const { getUserByUsername } = useUser();

	/**
	 * Authenticate user.
	 *
	 * @param {string} username
	 * @param {string} pin
	 * @param {Object} options
	 * @param {string} [options.processCode=null]
	 * @param {boolean} [options.autoState=true]
	 * 
	 * @returns {string|boolean}
	 */
	const authenticate = async (
		username,
		pin,
		{
			processCode = null,
			autoState = true,
		} = {}
	) => {
		const user = getUserByUsername(username);

		if(user == null || !checkPinCode(pin, user.pin))
			return t('errors:auth.failed')

		const code = processCode ?? uuid.v4();

		await dispatch(authenticateAction({
			user,
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
	 * @param {Object} options
	 * @param {string} [options.processCode=null]
	 * @param {boolean} [options.autoState=true]
	 *
	 * @returns {string|boolean}
	 */
	const logout = async ({processCode = null, autoState = true}) => {
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

	return {
		authenticate,
		logout,
		authOnProcessing,
		isAuth,
	};

}