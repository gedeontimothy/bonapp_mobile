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
