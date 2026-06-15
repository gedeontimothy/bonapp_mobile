import { is_number } from "../../../utils/check";
import { filterObject } from "../../../utils/helpers";

/**
 * Selector to get a specific process.
 *
 * @param {{processSliceName: string, code: string}} args
 * @returns {(state: TProcessSelectorState) => TProcess | null}
 */
export const getProcess = ({processSliceName, code}) => (state) => state.process.processes[processSliceName]?.[code] ?? null;

/**
 * Selector to get all processes of a category.
 *
 * @param {string} processSliceName
 * @returns {(state: TProcessSelectorState) => {[code: string]: TProcess}}
 */
export const getProcesses = (processSliceName) => (state) => state.process.processes[processSliceName] || {};

/**
 * Selector to get processes filtered by action type.
 *
 * @param {{processSliceName: string, actionType: string}} args
 * @returns {(state: TProcessSelectorState) => TProcess}
 */
export const getProcessesByActionType = ({ processSliceName, actionType }) => (state) => filterObject(getProcesses(processSliceName)(state), value => value.actionType === actionType);

/**
 * Counts the total number of pending processes across all categories.
 *
 * @param {TProcessSelectorState} state
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
 * @returns {(state: TProcessSelectorState) => number}
 */
export const countPendingProcess = (processSliceName) => 
	(state) => is_number(state.process.countProcessesOnPending?.[processSliceName].global)
		? state.process.countProcessesOnPending[processSliceName].global
		: 0;

/**
 * Counts the number of pending processes for a specific category by action type.
 *
 * @param {{processSliceName: string, code: string}} args
 * @returns {(state: TProcessSelectorState) => number}
 */
export const countPendingProcessByActionType = ({processSliceName, actionType}) => 
	(state) => is_number(state.process.countProcessesOnPending?.[processSliceName].action?.[actionType])
		? state.process.countProcessesOnPending[processSliceName].action[actionType]
		: 0;

/**
 * Builds an object of selectors for a specific category.
 *
 * @param {string} processSliceName
 */
export const buildProcessSelectors = processSliceName => ({
	/**
	 * Get a specific process.
	 * 
	 * @param {string} code
	 * 
	 * @returns {(state: TProcessSelectorState) => (TProcess | null)}
	 */
	getProcess : (code) => getProcess({processSliceName, code}),

	/**
	 * Get all processes.
	 * 
	 * @param {TProcessSelectorState} state 
	 * @returns {{
	 *   [code: string]: TProcess
	 * }}
	 */
	getProcesses : (state) => getProcesses(processSliceName)(state),

	/**
	 * Get processes filtered by action type.
	 * 
	 * @param {string} actionType
	 * 
	 * @returns {(state: TProcessSelectorState) => {
	 *   [code: string]: TProcess
	 * } | null}
	 */
	getProcessesByActionType : (actionType) => getProcessesByActionType({ processSliceName, actionType }),

	/**
	 * Counts the number of pending processes.
	 * 
	 * @param {TProcessSelectorState} state 
	 * @returns {number}
	 */
	countPendingProcess: (state) => countPendingProcess(processSliceName)(state),

	/**
	 * Counts the number of pending processes by action type.
	 * 
	 * @param {string} actionType 
	 * 
	 * @returns {(state: TProcessSelectorState) => number}
	 */
	countPendingProcessByActionType: (actionType) => countPendingProcessByActionType({ processSliceName, actionType }),
});

export const {
	getProcess: getPersonProcess,
	getProcesses: getPersonProcesses,
	getProcessesByActionType: getPersonProcessesByActionType,
	countPendingProcess: countPersonPendingProcess,
	countPendingProcessByActionType : countPendingPersonProcessByActionType,
} = buildProcessSelectors("people")
