import { Alert } from "react-native";
import { useEffect, useState } from "react";
import uuid from 'react-native-uuid'
import { getLocales } from "react-native-localize";
import { useDispatch, useSelector, useStore } from "react-redux";
import i18next from "i18next";

import { changeLanguage as changeLanguageAction } from "../store/features/lang/lang.slice";
import { availableLanguages, currentLanguage as currentLanguageSelector, getLangProcess } from "../store/features/lang/lang.selector";

/**
 * Custom hook for theme management.
 *
 * Provides the current theme, available themes,
 * loading state, and a function to change the theme.
 *
 * @returns {{
 *   changeLanguage: (theme: string) => Promise<void>,
 *   changeLanguageLoading: boolean,
 *   activeLanguage: string,
 *   currentLanguage: string,
 *   languages: Array<any>,
 *   osLanguage: string
 * }}
 */
export const useLanguage = () => {
	const dispatch = useDispatch();
	
	const currentLanguage = useSelector(currentLanguageSelector);
	const languages = useSelector(availableLanguages);
	const store = useStore();

	const osLanguage = getLocales()?.[0]?.languageCode;

	const [requestChangeLangCode, setRequestChangeLangCode] = useState(null);
	const [changeLanguageLoading, setChangeLanguageLoading] = useState(false);
	const [activeLanguage, setActiveLanguage] = useState("en");

	/**
	 * Change language.
	 *
	 * @param {string} theme
	 * @return {Promise<void>}
	 */
	const changeLanguage = async (lang) => {
		if(requestChangeLangCode !== null)
			ToastAndroid.show(i18next.t("lang:warning.changing"), ToastAndroid.LONG);
		else{
			const code = uuid.v4();

			setRequestChangeLangCode(code);

			await dispatch(changeLanguageAction({
				language: lang,
				process: {code}
			}))

			const process = getLangProcess(code)(store.getState())

			if(process.error)
				Alert.alert(i18next.t("errors:base"), process.error);

			setRequestChangeLangCode(null)
		}
	}
	
	useEffect(() => {
		setChangeLanguageLoading(requestChangeLangCode != null)
	}, [requestChangeLangCode])

	useEffect(() => {
		setActiveLanguage(languages.includes(osLanguage) && currentLanguage == 'system' ? osLanguage : currentLanguage);
	}, [currentLanguage])

	return {
		changeLanguage,
		changeLanguageLoading,

		activeLanguage,
		currentLanguage,
		languages,
		osLanguage,
	};
}
