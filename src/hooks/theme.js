import { Alert, ToastAndroid } from "react-native";
import { useEffect, useState } from "react";
import uuid from 'react-native-uuid'
import { useDispatch, useSelector, useStore } from "react-redux";
import i18next from "i18next";

import { availableThemes, countPendingSettingProcessByActionType, currentTheme as currentThemeSelector, getSettingProcess, activeTheme as activeThemeSelector, colorScheme as colorSchemeSelector } from "../store/features/settings/settings.selector";
import { changeTheme as changeThemeAction } from "../store/features/settings/settings.slice";

/**
 * Custom hook for theme management.
 *
 * Provides the current theme, available themes,
 * loading state, and a function to change the theme.
 *
 * @returns {{
 *   changeTheme: (theme: string) => Promise<void>,
 *   changeThemeLoading: boolean,
 *   activeTheme: string,
 *   currentTheme: string,
 *   themes: Array<any>,
 *   colorScheme: string
 * }}
 */
export const useTheme = () => {
	const dispatch = useDispatch();
	
	const currentTheme = useSelector(currentThemeSelector);
	const themes = useSelector(availableThemes);
	const store = useStore();

	const colorScheme = useSelector(colorSchemeSelector);

	const [requestChangeThemeCode, setRequestChangeThemeCode] = useState(null);
	const [changeThemeLoading, setChangeThemeLoading] = useState(false);
	const activeTheme = useSelector(activeThemeSelector);

	/**
	 * Change theme.
	 *
	 * @param {string} theme
	 * @return {Promise<void>}
	 */
	const changeTheme = async (theme, processCode) => {
		const count_setting_process = countPendingSettingProcessByActionType("settings/changeTheme")(store.getState());

		if(count_setting_process > 0)
			ToastAndroid.show(i18next.t("theme.warning.on-changing"), ToastAndroid.LONG);
		else{
			const code = processCode ?? uuid.v4();

			setRequestChangeThemeCode(code);

			await dispatch(changeThemeAction({
				theme,
				process: {code}
			}))

			const process = getSettingProcess(code)(store.getState())

			if(process.error)
				Alert.alert(t("errors.base"), process.error);

			setRequestChangeThemeCode(null)
		}
	}

	useEffect(() => {
		setChangeThemeLoading(requestChangeThemeCode != null)
	}, [requestChangeThemeCode])

	return {
		changeTheme,
		changeThemeLoading,

		activeTheme,
		currentTheme,
		themes,
		colorScheme,
	};
}
