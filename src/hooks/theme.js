import { Alert, ToastAndroid } from "react-native";
import { useEffect, useState } from "react";
import uuid from 'react-native-uuid'
import { useDispatch, useSelector, useStore } from "react-redux";
import i18next from "i18next";
import { useColorScheme } from 'react-native';

import { availableThemes, currentTheme as currentThemeSelector, getSettingProcess } from "../store/features/settings/settings.selector";
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
 *   currentTheme: string,
 *   currentThemeSelected: string,
 *   themes: Array<any>
 * }}
 */
export const useTheme = () => {
	const dispatch = useDispatch();
	
	const currentThemeSelected = useSelector(currentThemeSelector);
	const themes = useSelector(availableThemes);
	const store = useStore();

	const colorScheme = useColorScheme();

	const [requestChangeThemeCode, setRequestChangeThemeCode] = useState(null);
	const [changeThemeLoading, setChangeThemeLoading] = useState(false);
	const [currentTheme, setCurrentTheme] = useState("light");

	/**
	 * Change theme.
	 *
	 * @param {string} theme
	 * @return {Promise<void>}
	 */
	const changeTheme = async (theme) => {
		if(requestChangeThemeCode !== null)
			ToastAndroid.show(i18next.t("theme.warning.on-changing"), ToastAndroid.LONG);
		else{
			const code = uuid.v4();

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

	useEffect(() => {
		setCurrentTheme(currentThemeSelected == 'system' ? colorScheme : currentThemeSelected);
	}, [currentThemeSelected])

	return {
		changeTheme,
		changeThemeLoading,

		currentTheme,
		currentThemeSelected,
		themes,
	};
}
