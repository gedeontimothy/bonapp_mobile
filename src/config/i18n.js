import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import { store } from '../store';

import en from '../locales/en.json';
import fr from '../locales/fr.json';
import { activeLang } from '../store/features/lang/lang.selector';

let initialized = false;

export async function initI18n(language) {
	if (initialized) return;

	await i18n
		.use(initReactI18next)
		.init({
			resources: {
				en: {translation: en},
				fr: {translation: fr},
			},
			lng: language,
			fallbackLng: 'en',
			interpolation: {
				escapeValue: false,
			},
			react: {
				useSuspense: false,
			},
		});
		
		store.subscribe(() => {
			const currentLanguage = activeLang(store.getState());
			i18n.changeLanguage(currentLanguage);
		});

	initialized = true;
}

export default i18n;
