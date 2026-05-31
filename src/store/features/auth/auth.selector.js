import { createSelector } from "@reduxjs/toolkit";
import { buildProcessSelectors } from "../process/process.selector";

/**
 * Check if user is authenticate.
 *
 * @returns {boolean}
 */
export const isAuth = createSelector(
	[(state) => state.auth.user],
	(user) => user ? true : false
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
