import { is_async_function } from "./check";

/**
 * Executes a callback after a delay.
 *
 * Supports both synchronous and asynchronous callbacks.
 *
 * @param {Function} callBack - Function to execute.
 * @param {number} timeout - Delay in milliseconds.
 * @returns {Promise<void>}
 */
export const delay = (callBack, timeout) => {
	return new Promise((resolve) => {
		if(is_async_function(callBack))
			setTimeout(async () => {
				await callBack();
				resolve();
			}, timeout);
		else
			setTimeout(() => {
				callBack();
				resolve();
			}, timeout);
	})
}

 /**
  * Hexadecimal color to rgba color.
  *
  * @param {string} hex
  * @param {number} alpha
  * @return {string}
  */
export const hexToRgba = (hex, alpha = 1) => {
	const cleanHex = hex.replace("#", "");

	const r = parseInt(cleanHex.substring(0, 2), 16);
	const g = parseInt(cleanHex.substring(2, 4), 16);
	const b = parseInt(cleanHex.substring(4, 6), 16);

	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Executes a managed process with concurrency control, state tracking, and optional error handling.
 *
 * This function acts as a generic orchestration layer around asynchronous operations.
 * It prevents concurrent execution of the same type of process, dispatches process state updates,
 * and handles success/failure state transitions when enabled.
 *
 * @param {Function} call - The async operation to execute (e.g. API call, service function).
 * @param {Object} options - Configuration object for process execution.
 * @param {Object} options.store - Redux store used to dispatch process actions.
 * @param {Function} options.countProcess - Selector function that returns the number of pending processes.
 * @param {string} options.code - Unique identifier for the process instance.
 * @param {boolean} [options.autoState=true] - If true, automatically manages process state (pending/fulfilled/rejected).
 * @param {?Function} [options.onConcurrent=null] - Callback triggered when a concurrent process is already running.
 * @param {Function} options.addProcess - Action creator to register a new process in pending state.
 * @param {Function} options.setProcess - Action creator to update process state (fulfilled/rejected).
 * @param {string} options.actionType - Identifier describing the type of operation being executed.
 * @param {string} options.concurrentMessage - i18n key used when a concurrent operation blocks execution.
 * @param {Function} options.t - Translation function used to resolve i18n messages.
 *
 * @returns {*} Result of the executed `call` function, or `null` if execution is blocked or fails.
 */
export const executeProcess = (call, {
	store,
	countProcess,
	onConcurrent,
	code,
	addProcess,
	actionType,
	autoState,
	setProcess,
	concurrentMessage,
	t,
}) => {
	const count_pending_process = countProcess(store.getState());

	if(count_pending_process > 0){
		if(onConcurrent)
			onConcurrent(count_pending_process)
		else
			ToastAndroid.show(t(concurrentMessage), ToastAndroid.LONG);
		return null;
	}

	store.dispatch(addProcess({
		code,
		actionType,
		processState: "pending",
	}));

	try {
		const results = call();

		if(autoState)
			store.dispatch(setProcess({
				code,
				processState: "fulfilled",
			}))

		return results;

	} catch (error) {
		store.dispatch(setProcess({
			code,
			error: error.message,
			...(autoState
				? {processState: "rejected"}
				: {}
			),
		}));
	}

	return null;
}
