import { SHA256 } from "crypto-js";
import { is_async_function, is_string } from "./check";

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
 * Executes a process with concurrency control and optional state management.
 *
 * If a process limit is reached, execution is blocked and a concurrency
 * handler or message is triggered. When a process `code` is provided,
 * the process can be automatically tracked and updated in the store.
 *
 * @async
 *
 * @param {Function} call - Async or synchronous function to execute.
 * @param {Object} options - Execution options.
 * @param {Object} options.store - Redux store.
 * @param {(state: Object) => number} options.countProcess - Returns the number of pending processes.
 * @param {number} [options.minProcesses=0] - Maximum allowed pending processes before blocking execution.
 * @param {((number_of_pending_processes: number) => void) | null} [options.onConcurrent] - Called when execution is blocked by concurrency rules.
 * @param {string|null} [options.code=null] - Unique process identifier.
 * @param {string} [options.processState="pending"] - Initial process state.
 * @param {Function} options.addProcess - Action creator used to register a process.
 * @param {Function} options.setProcess - Action creator used to update a process.
 * @param {string} options.actionType - Process action type.
 * @param {boolean} options.autoState - Automatically sets fulfilled/rejected states.
 * @param {string|[key: string, options: Object]} options.concurrentMessage - Message shown when execution is blocked.
 * @param {boolean} [options.safeReturn=false] - Returns a structured result instead of `null`.
 * @param {(key: string, options: Object) => string} options.t - Translation function.
 *
 * @returns {Promise<any|Object|null>}
 */
export const executeProcess = async function(call, {
	store,
	countProcess,
	minProcesses=0,
	onConcurrent,
	code=null,
	processState="pending",
	addProcess,
	actionType,
	autoState,
	setProcess,
	concurrentMessage,
	safeReturn=false,
	t,
}) {
	const count_pending_process = countProcess(store.getState());

	if(count_pending_process > minProcesses){

		const concurrent_message = t(...(is_string(concurrentMessage)
			? [concurrentMessage]
			: concurrentMessage)
		);

		if(onConcurrent)
			onConcurrent(count_pending_process)
		else
			ToastAndroid.show(
				concurrent_message,
				ToastAndroid.LONG
			);

		if(safeReturn) return {error: true, isConcurrent: true, message: concurrent_message}

		return null;
	}

	if(code)
		store.dispatch(addProcess({
			code,
			actionType,
			processState,
		}));

	try {
		const results = await call();

		if(code && autoState)
			store.dispatch(setProcess({
				code,
				processState: "fulfilled",
			}))
		
		if(safeReturn) return {error: false, isConcurrent: false, data : results};

		return results;

	} catch (error) {
		if(code){
			store.dispatch(setProcess({
				code,
				error: error.message,
				...(autoState
					? {processState: "rejected"}
					: {}
				),
			}));
		}

		console.warn(actionType, error);

		if(safeReturn) return {error, isConcurrent: false, message: error.message};
	}

	return null;
}

/**
 * Check pin code.
 *
 * @param {string} pin - PIN code
 * @param {string} hashPin - Hashed PIN code
 * @returns {boolean}
 */
export const checkPinCode = (pin, hashPin) => {
	return hashPin == hash(pin);
}

 /**
  * Hash message.
  *
  * @param {string} message
  * @returns {string}
  */
export const hash = (message) => {
	return SHA256(message).toString();
}
