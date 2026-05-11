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
