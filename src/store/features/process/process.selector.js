import { is_number } from "../../../utils/check";

/**
 * Selector to get a specific process.
 *
 * @param {{processSliceName: string, code: string}} args
 * @returns {(state: Object) => Object | null}
 */
export const getProcess = ({processSliceName, code}) => (state) => state.process.processes[processSliceName]?.[code] ?? null;

/**
 * Selector to get all processes of a category.
 *
 * @param {string} processSliceName
 * @returns {(state: Object) => Object}
 */
export const getProcesses = (processSliceName) => (state) => state.process.processes[processSliceName] || {};

/**
 * Selector to get processes filtered by action type.
 *
 * @param {{processSliceName: string, actionType: string}} args
 * @returns {(state: Object) => Object}
 */
export const getProcessesByActionType = ({ processSliceName, actionType }) => (state) => Object.fromEntries(Object
	.entries(getProcesses(processSliceName)(state))
	.filter(([k, p]) => p.actionType === actionType)
);

/**
 * Counts the total number of pending processes across all categories.
 *
 * @param {Object} state
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
 * @returns {(state: Object) => number}
 */
export const countPendingProcess = (processSliceName) => 
	(state) => is_number(state.process.countProcessesOnPending?.[processSliceName].global)
		? state.process.countProcessesOnPending[processSliceName].global
		: 0;

/**
 * Counts the number of pending processes for a specific category by action type.
 *
 * @param {{processSliceName: string, code: string}} args
 * @returns {(state: Object) => number}
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
	 * @returns {(state: Object) => ({
	 *   actionType: string,
	 *   processState: "rejected" | "fulfilled" | "pending",
	 *   progress: ?number,
	 *   error: ?string,
	 *   requestId: ?string
	 * } | null)}
	 */
	getProcess : (code) => getProcess({processSliceName, code}),

	/**
	 * Get all processes.
	 * 
	 * @param {Object} state 
	 * @returns {{
	 *   [code: string]: {
	 *     actionType: string,
	 *     processState: "rejected" | "fulfilled" | "pending",
	 *     progress: ?number,
	 *     error: ?string,
	 *     requestId: ?string
	 *   }
	 * }}
	 */
	getProcesses : (state) => getProcesses(processSliceName)(state),

	/**
	 * Get processes filtered by action type.
	 * 
	 * @param {string} actionType
	 * 
	 * @returns {(state: Object) => {
	 *   [code: string]: {
	 *     actionType: string,
	 *     processState: "rejected" | "fulfilled" | "pending",
	 *     progress: ?number,
	 *     error: ?string,
	 *     requestId: ?string
	 *   }
	 * } | null}
	 */
	getProcessesByActionType : (actionType) => getProcessesByActionType({ processSliceName, actionType }),

	/**
	 * Counts the number of pending processes.
	 * 
	 * @param {Object} state 
	 * @returns {number}
	 */
	countPendingProcess: (state) => countPendingProcess(processSliceName)(state),

	/**
	 * Counts the number of pending processes by action type.
	 * 
	 * @param {string} actionType 
	 * 
	 * @returns {(state: Object) => number}
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
