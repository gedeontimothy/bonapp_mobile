import i18next from "i18next";
import { peopleErrorMap } from "./people.error.mapper";
import { usersErrorMap } from "./users.error.mapper";
import { is_function } from "../check";

const mergedErrorMap = new Map([...usersErrorMap, ...peopleErrorMap]);

/**
 * Checks if the error class exists in the mapper and returns its i18n key.
 *
 * @param {Error} err - The error instance to check
 * @param {Map} map - The error mapping
 * @returns {string|undefined} - i18n key if found, undefined otherwise
 */
function getMappedErrorKey(err, map) {
  return map.has(err.constructor) ? map.get(err.constructor) : undefined;
}

/**
 * Maps a known error to its i18n message.
 *
 * @param {Error} err - The error instance
 * @param {typeof i18next.t} t - The i18n translation function
 * @returns {string} Translated error message
 */
export function mapErrorToMessage(err, t) {
	const key = getMappedErrorKey(err, mergedErrorMap);
	return key ? t(key, err?.translateKeys && is_function(err.translateKeys) ? err.translateKeys() : {}) : err.message; //t('error.generic');
}
