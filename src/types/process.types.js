/**
 * @typedef {"pending" | "fulfilled" | "rejected"} TProcessProcessState
 */

/**
 * @typedef {Object} TProcess
 * @property {string} actionType - Type of action
 * @property {TProcessProcessState} processState - Initial process state
 * @property {number} [progress] - Process progression
 * @property {string} [error] - Error message
 * @property {string} [requestId] - Request ID
 */

/**
 * @typedef {Object} TProcessPendingCounter
 * @property {number} global
 * @property {{
 *   [actionType: string] : number
 * }} action
 */

/**
 * @typedef {Object} TProcessState
 * @property {{[processSliceName: string]: {[code: string]: TProcess}}} processes
 * @property {{[processSliceName: string]: TProcessPendingCounter}} countProcessesOnPending
 */

/**
 * @typedef {Object} TProcessSelectorState
 * @property {TProcessState} process
 */

/**
 * @typedef {Object} TProcessDestructParam
 * @property {string} processCode
 * @property {TProcessProcessState} processState
 * @property {boolean} [autoState=true]
 */
