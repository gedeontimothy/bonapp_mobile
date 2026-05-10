import { createSelector } from "@reduxjs/toolkit";
import { buildProcessSelectors, getProcess, getProcesses, getProcessesByActionType } from "../process/process.selector";

/**
 * Retrieves the current language select
 *
 * @param {object} state - The Redux state
 * @returns {string}
 */
export const currentLanguage = (state) => state.lang.currentLanguage;

/**
 * Returns the list of available languages
 *
 * @param {object} state - The Redux state
 * @returns {string[]}
 */
export const availableLanguages = (state) => state.lang.availableLanguages;

/**
 * Returns the list of available languages excluding the current language
 *
 * @var {string[]}
 */
export const otherAvailableLanguages = createSelector(
	[availableLanguages, currentLanguage],
	(langs, current) => langs.filter(lang => lang !== current)
);

/**
 * Check if any language is current laguage.
 *
 * @var {boolean}
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
