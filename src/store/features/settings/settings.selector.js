import { createSelector } from "@reduxjs/toolkit";
import { buildProcessSelectors } from "../process/process.selector";
import color from "../../../theme/color";

/**
 * Retrieves the current theme select
 *
 * @param {TSettingsSelectorState} state - The Redux state
 * 
 * @returns {TTheme}
 */
export const currentTheme = (state) => state.settings.theme.current;

/**
 * Retrieves color scheme
 *
 * @param {TSettingsSelectorState} state - The Redux state
 * 
 * @returns {TThemeScheme}
 */
export const colorScheme = (state) => state.settings.theme.colorScheme;

/**
 * Retrieves the active theme
 *
 * @type {(state: TSettingsSelectorState) => TThemeActive}
 */
export const activeTheme = createSelector(
	[currentTheme, colorScheme],
	(current_theme, color_scheme) => current_theme == 'system' && color_scheme 
		? color_scheme
		: current_theme
);

/**
 * Returns color theme selected
 * 
 * @type {(state: TSettingsSelectorState) => TThemeBaseColor}
 */
export const themeColor = createSelector(
	[activeTheme],
	(theme) => color[theme]
);

/**
 * Returns the list of available themes
 *
 * @param {TSettingsSelectorState} state - The Redux state
 * 
 * @returns {TTheme}
 */
export const availableThemes = (state) => state.settings.theme.availableThemes;

/**
 * Returns the list of available themes excluding the current theme
 *
 * @type {(state: TSettingsSelectorState) => Array<TTheme>}
 */
export const otherAvailableThemes = createSelector(
	[availableThemes, currentTheme],
	(themes, current) => themes.filter(theme => theme !== current)
);

/**
 * Check if any theme is current theme.
 *
 * @param {TTheme} theme
 * 
 * @returns {(state: TSettingsSelectorState) => boolean}
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
