import { createSelector } from "@reduxjs/toolkit";
import { buildProcessSelectors } from "../process/process.selector";

/**
 * Get the authenticated user.
 * 
 * @param {Object} state
 *
 * @returns {?Object}
 */
export const authUser = (state) => state.auth.user;

/**
 * Check if user is authenticate.
 *
 * @param {Object} state
 * 
 * @returns {boolean}
 */
export const isAuth = createSelector(
	[authUser],
	(user) => user ? true : false
);

/**
 * Get all user profiles.
 *
 * @param {Object} state
 * @returns {{
 *   [userId: string] : {
 *     user: Object,
 *     preferences: Object
 *   }
 * } | null}
 */
export const profiles = (state) => state.auth.userProfiles;

/**
 * Get user profile.
 * 
 * @param {string} userId
 * 
 * @returns {(state: Object) => {
 *   user: Object,
 *   preferences: Object
 * } | undefined}
 */
export const profile = userId => state => state.auth.userProfiles?.[userId];

/**
 * Check if user profile exists.
 * 
 * @param {string} userId 
 * 
 * @returns {(state: Object) => boolean}
 */
export const profileExists = userId => state => state.auth?.userProfiles?.[userId] ? true : false;

/**
 * Retrieves profile of authenticated user.
 * 
 * @param {Object} state
 * 
 * @returns {{
 *   user: Object,
 *   preferences: Object
 * } | null}
 */
export const authProfile = createSelector(
	[authUser, profiles],
	(user, profiles) => user && user?._id && profiles?.[user._id]
		? profiles[user._id]
		: null
);

/**
 * Retrieves all current preferences for profile.
 * 
 * @param {Object} state
 */
export const currentUserPreferences = state => ({
	lang: state.lang.currentLanguage,
	theme: state.settings.theme.current,
})

/**
 * Count number of profiles.
 * 
 * @param {Object} state
 * 
 * @returns {number}
 */
export const countProfiles = createSelector(
	[profiles],
	(profiles) => Object.values(profiles).length
);

export const {
	getProcess: getAuthProcess,
	getProcesses: getAuthProcesses,
	getProcessesByActionType: getAuthProcessesByActionType,
	countPendingProcess: countAuthPendingProcess,
	countPendingProcessByActionType : countPendingAuthProcessByActionType,
} = buildProcessSelectors("auth")

/**
 * Check if auth process is on processing.
 * 
 * @returns {boolean}
 */
export const authOnProcessing = createSelector(
	[countAuthPendingProcess],
	(countProcess) => {
		return countProcess > 0;
	}
);
