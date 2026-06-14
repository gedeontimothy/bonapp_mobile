import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import { store } from '../store';

import { activeLang } from '../store/features/lang/lang.selector';

import resources from '../locales';

let initialized = false;

export async function initI18n(language) {
	if (initialized) return;

	await i18n
		.use(initReactI18next)
		.init({
			compatibilityJSON: 'v3',

			resources,

			lng: language,
			fallbackLng: 'en',

			defaultNS: 'screens',
			ns: [
				'common',
				'feedback',
				'errors',
				'validations',

				'screens',

				'lang',
				'theme',
			],

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
