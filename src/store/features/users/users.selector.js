import { createSelector } from "@reduxjs/toolkit";
import { buildProcessSelectors } from "../process/process.selector";


export const {
	getProcess: getUserProcess,
	getProcesses: getUserProcesses,
	getProcessesByActionType: getUserProcessesByActionType,
	countPendingProcess: countUserPendingProcess,
	countPendingProcessByActionType : countPendingUserProcessByActionType,
} = buildProcessSelectors("users")
