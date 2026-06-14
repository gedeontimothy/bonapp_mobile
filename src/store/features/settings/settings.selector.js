import { createSelector } from "@reduxjs/toolkit";
import { buildProcessSelectors } from "../process/process.selector";
import color from "../../../theme/color";

/**
 * Retrieves the current theme select
 *
 * @param {TThemeSelectorState} state - The Redux state
 * 
 * @returns {TThemeKey}
 */
export const currentTheme = (state) => state.settings.theme.current;

/**
 * Retrieves color scheme
 *
 * @param {TThemeSelectorState} state - The Redux state
 * 
 * @returns {TSchemeTheme}
 */
export const colorScheme = (state) => state.settings.theme.colorScheme;

/**
 * Retrieves the active theme
 *
 * @param {TThemeSelectorState} state - The Redux state
 * 
 * @returns {TActiveTheme}
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
 * @param {TThemeSelectorState} state
 * 
 * @returns {TThemeBaseColor}
 */
export const themeColor = createSelector(
	[activeTheme],
	(theme) => color[theme]
);

/**
 * Returns the list of available themes
 *
 * @param {TThemeSelectorState} state - The Redux state
 * 
 * @returns {TTheme}
 */
export const availableThemes = (state) => state.settings.theme.availableThemes;

/**
 * Returns the list of available themes excluding the current theme
 *
 * @param {TThemeSelectorState} state
 * 
 * @returns {Array<TThemeKey>}
 */
export const otherAvailableThemes = createSelector(
	[availableThemes, currentTheme],
	(themes, current) => themes.filter(theme => theme !== current)
);

/**
 * Check if any theme is current theme.
 *
 * @param {TThemeKey} theme
 * 
 * @returns {(state: TThemeSelectorState) => boolean}
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
