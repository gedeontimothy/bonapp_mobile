import { is_number } from "../../../utils/check";

/**
 * Selector to get a specific process.
 *
 * @param {object} args - { processSliceName, code }
 * @returns {Function}
 */
export const getProcess = ({processSliceName, code}) => (state) => state.process.processes[processSliceName]?.[code] ?? null;

/**
 * Selector to get all processes of a category.
 *
 * @param {string} processSliceName
 * @returns {Function}
 */
export const getProcesses = (processSliceName) => (state) => state.process.processes[processSliceName] || {};

/**
 * Selector to get processes filtered by action type.
 *
 * @param {object} args - { processSliceName, actionType }
 * @returns {Function}
 */
export const getProcessesByActionType = ({ processSliceName, actionType }) => (state) => Object.fromEntries(Object
	.entries(getProcesses(processSliceName)(state))
	.filter(([k, p]) => p.actionType === actionType)
);

/**
 * Counts the total number of pending processes across all categories.
 *
 * @param {object} state
 * @returns {number}
 */
export const countPendingProcesses = (state) => Object
	.values(state.process.countProcessesOnPending)
	.reduce((sum, val) => sum + (is_number(val.global) ? val.global : 0), 0)
;

/**
 * Counts the number of pending processes for a specific category.
 *
 * @param {string} processSliceName
 * @returns {Function}
 */
export const countPendingProcess = (processSliceName) => 
	(state) => is_number(state.process.countProcessesOnPending?.[processSliceName].global)
		? state.process.countProcessesOnPending[processSliceName].global
		: 0;

/**
 * Counts the number of pending processes for a specific category by action type.
 *
 * @param {object} args - { processSliceName, code }
 * @returns {Function}
 */
export const countPendingProcessByActionType = ({processSliceName, actionType}) => 
	(state) => is_number(state.process.countProcessesOnPending?.[processSliceName].action?.[actionType])
		? state.process.countProcessesOnPending[processSliceName].action[actionType]
		: 0;

/**
 * Builds an object of selectors for a specific category.
 *
 * @param {string} processSliceName
 * @returns {object}
 */
export const buildProcessSelectors = processSliceName => ({
	getProcess : (code) => getProcess({processSliceName, code}),
	getProcesses : (state) => getProcesses(processSliceName)(state),
	getProcessesByActionType : (actionType) => getProcessesByActionType({ processSliceName, actionType }),

	countPendingProcess: (state) => countPendingProcess(processSliceName)(state),
	countPendingProcessByActionType: (actionType) => countPendingProcessByActionType({ processSliceName, actionType }),
});

export const {
	getProcess: getPersonProcess,
	getProcesses: getPersonProcesses,
	getProcessesByActionType: getPersonProcessesByActionType,
	countPendingProcess: countPersonPendingProcess,
	countPendingProcessByActionType : countPendingPersonProcessByActionType,
} = buildProcessSelectors("people")
