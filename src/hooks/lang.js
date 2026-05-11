import { Alert } from "react-native";
import { useEffect, useState } from "react";
import uuid from 'react-native-uuid'
import { getLocales } from "react-native-localize";
import { useDispatch, useSelector, useStore } from "react-redux";

import { changeLanguage as changeLanguageAction } from "../store/features/lang/lang.slice";
import { availableLanguages, currentLanguage as currentLanguageSelector, getLangProcess } from "../store/features/lang/lang.selector";

export const useLanguage = () => {
	const dispatch = useDispatch();
	
	const currentLanguage = useSelector(currentLanguageSelector);
	const languages = useSelector(availableLanguages);
	const store = useStore();

	const osLanguage = getLocales()?.[0]?.languageCode;

	const [requestChangeLangCode, setRequestChangeLangCode] = useState(null);
	const [changeLanguageLoading, setChangeLanguageLoading] = useState(false);
	const [activeLang, setActiveLang] = useState("en");

	const changeLanguage = async (lang) => {
		if(requestChangeLangCode !== null)
			ToastAndroid.show(i18next.t("lang.warning.on-changing"), ToastAndroid.LONG);
		else{
			const code = uuid.v4();

			setRequestChangeLangCode(code);

			await dispatch(changeLanguageAction({
				language: lang,
				process: {code}
			}))

			const process = getLangProcess(code)(store.getState())

			if(process.error)
				Alert.alert(t("errors.base"), process.error);

			setRequestChangeLangCode(null)
		}
	}
	
	useEffect(() => {
		setChangeLanguageLoading(requestChangeLangCode != null)
	}, [requestChangeLangCode])

	useEffect(() => {
		setActiveLang(languages.includes(osLanguage) && currentLanguage == 'system' ? osLanguage : currentLanguage);
	}, [currentLanguage])

	return {
		changeLanguage,
		changeLanguageLoading,

		activeLang,
		currentLanguage,
		languages,
		osLanguage,
	};
}
