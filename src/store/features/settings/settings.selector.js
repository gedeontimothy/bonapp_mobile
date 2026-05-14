import { createSelector } from "@reduxjs/toolkit";
import { buildProcessSelectors } from "../process/process.selector";

/**
 * Retrieves the current theme select
 *
 * @param {object} state - The Redux state
 * @returns {string}
 */
export const currentTheme = (state) => state.settings.theme.current;

/**
 * Retrieves color scheme
 *
 * @param {object} state - The Redux state
 * @returns {string}
 */
export const colorScheme = (state) => state.settings.theme.colorScheme;

/**
 * Retrieves the active theme
 *
 * @param {object} state - The Redux state
 * @returns {string}
 */
export const activeTheme = createSelector(
	[currentTheme, colorScheme],
	(current_theme, color_scheme) => current_theme == 'system' && color_scheme 
		? color_scheme
		: current_theme
);

/**
 * Returns the list of available themes
 *
 * @param {object} state - The Redux state
 * @returns {string[]}
 */
export const availableThemes = (state) => state.settings.theme.availableThemes;

/**
 * Returns the list of available themes excluding the current theme
 *
 * @var {string[]}
 */
export const otherAvailableThemes = createSelector(
	[availableThemes, currentTheme],
	(themes, current) => themes.filter(theme => theme !== current)
);

/**
 * Check if any theme is current theme.
 *
 * @var {boolean}
 */
export const isCurrentTheme = (theme) => createSelector(
	[currentTheme],
	(current_theme) => theme == current_theme
);

export const {
	getProcess: getSettingProcess,
	getProcesses: getSettingProcesses,
	getProcessesByActionType: getSettingProcessesByActionType,
	countPendingProcess: countSettingPendingProcess,
	countPendingProcessByActionType : countPendingSettingProcessByActionType,
} = buildProcessSelectors("settings")
