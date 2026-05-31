import { createSelector } from "@reduxjs/toolkit";
import { buildProcessSelectors } from "../process/process.selector";


export const {
	getProcess: getUserProcess,
	getProcesses: getUserProcesses,
	getProcessesByActionType: getUserProcessesByActionType,
	countPendingProcess: countUserPendingProcess,
	countPendingProcessByActionType : countPendingUserProcessByActionType,
} = buildProcessSelectors("users")

/**
 * Check if user process is on processing.
 * 
 * @returns {boolean}
 */
export const userOnProcessing = createSelector(
	[countUserPendingProcess],
	(countProcess) => {
		return countProcess > 0;
	}
);
