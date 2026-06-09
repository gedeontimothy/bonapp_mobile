import { createSelector } from "@reduxjs/toolkit";
import { getLocales } from "react-native-localize";

import { buildProcessSelectors, getProcess, getProcesses, getProcessesByActionType } from "../process/process.selector";

/**
 * Retrieves the current language select
 *
 * @param {Object} state - The Redux state
 * @returns {string}
 */
export const currentLanguage = (state) => state.lang.currentLanguage;

/**
 * Returns the list of available languages
 *
 * @param {Object} state - The Redux state
 * @returns {Array<string>}
 */
export const availableLanguages = (state) => state.lang.availableLanguages;

/**
 * Retrieves the active language
 *
 * @param {Object} state - The Redux state
 * @returns {string}
 */
export const activeLang = createSelector(
	[availableLanguages, currentLanguage],
	(langs, current) => {
		const osLanguage = getLocales()?.[0]?.languageCode;
		return langs.includes(osLanguage) && current == 'system'
			? osLanguage
			: current
	}
)

/**
 * Returns the list of available languages excluding the current language
 *
 * @var {Array<string>}
 */
export const otherAvailableLanguages = createSelector(
	[availableLanguages, currentLanguage],
	(langs, current) => langs.filter(lang => lang !== current)
);

/**
 * Check if any language is current laguage.
 *
 * @param {string} language
 * @returns {(state: Object) => boolean}
 */
export const isCurrentLanguage = (language) => createSelector(
	[currentLanguage],
	(current_language) => language == current_language
);

export const {
	getProcess: getLangProcess,
	getProcesses: getLangProcesses,
	getProcessesByActionType: getLangProcessesByActionType,
	countPendingProcess: countLangPendingProcess,
	countPendingProcessByActionType : countPendingLangProcessByActionType,
} = buildProcessSelectors("lang")
