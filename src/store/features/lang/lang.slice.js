import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';

import { availableLanguages, isCurrentLanguage, otherAvailableLanguages } from './lang.selector';
import { builProcessThunks } from '../process/process.slice';

import { is_string } from '../../../utils/check';
import { createStorageAsyncThunk } from '../../../hooks';
import { getLocales } from 'react-native-localize';

const initialState = {
	currentLanguage: "en",
	availableLanguages : ["fr", "en",],
};

export const langSlice = createSlice({
	name: 'lang',

	initialState,

	reducers: {

		/**
		 * Set a current language.
		 *
		 * @param {object} state
		 * @param {object} action
		 * @param {string} action.payload - Language
		 */
		setCurrentLanguage(state, action){
			state.currentLanguage = action.payload;
		},

	},
	extraReducers: (builder) => {

		builder
			.addCase(initLang.fulfilled, (state, action) => {
				if(is_string(action?.payload)){
					langSlice.caseReducers.setCurrentLanguage(state, { payload : action.payload });
				}
			})
			.addCase(initLang.rejected, (state, action) => {
				console.log("->", action.payload)
			})
		
		builder
			.addCase(changeLanguage.fulfilled, (state, action) => {
				langSlice.caseReducers.setCurrentLanguage(state, { payload : action.payload });
			})
	},

});

/**
 * Initialize language.
 *
 * @returns {object}
 */
export const initLang = createStorageAsyncThunk(
	'lang/initLang',
	['store.lang.current.language'],
	async (action, data, {rejectWithValue, getState}, error) => {
		if(error !== false){
			return rejectWithValue(error.message);
		}

		const osLanguage = getLocales()?.[0]?.languageCode;

		const langs = availableLanguages(getState());

		let lang = data?.['store.lang.current.language']?.['currentLanguage'];

		if(is_string(lang) && !langs.includes(lang)){
			return rejectWithValue(i18next.t(
				"lang.errors.not-available",
				{language: i18next.t("lang." + lang)}
			))
		}
		// console.log("-->", osLanguagçe, lang)
		if(!is_string(lang) && langs.includes(osLanguage))
			lang = osLanguage;

		return lang;
	},
	false
);

/**
 * Initialize language.
 *
 * @returns {object}
 */
export const changeLanguage = createAsyncThunk(
	'lang/changeLanguage',
	async ({language, process = null}, { rejectWithValue, getState, dispatch, requestId }) => {
		const {code, processState, autoState = true} = process ?? {};

		try{
			if(code){
				dispatch(addLangProcess({
					code,
					actionType : "lang/changeLanguage",
					processState: processState ?? "pending",
					requestId,
				}))
			}

			const langs = otherAvailableLanguages(getState())
			
			const error = isCurrentLanguage(language)(getState()) 
				? i18next.t("lang.errors.already", {language: i18next.t("lang." + language)}) 
				: (!langs.includes(language)
					? i18next.t("lang.errors.not-available", {language: i18next.t("lang." + language)})
					: null
				)
			;

			if(error){

				if(code) dispatch(setLangProcess({code, error, ...(!autoState ? {} : {processState: "rejected"}),}));

				return rejectWithValue({code, message: error});

			}

			await AsyncStorage.setItem('store.lang.current.language', JSON.stringify({
				currentLanguage : language,
			}));
			
			if(code) dispatch(setLangProcess({code, ...(!autoState ? {} : {processState: "fulfilled"}),}));

			return language;
		}
		catch(e){
			const error = "Error";

			if(code) dispatch(setLangProcess({code, error, ...(!autoState ? {} : {processState: "rejected"}),}));

			return rejectWithValue({language, code, error});
		}
	}
);

export const {
	addProcess: addLangProcess,
	setProcess: setLangProcess,
	setProcessState: setLangProcessState,
	removeProcess: removeLangProcess,
	markPendingProcessState: markPendingLangProcessState,
	markRejectedProcessState: markRejectedLangProcessState,
	markFulfilledProcessState: markFulfilledLangProcessState,
} = builProcessThunks("lang");


export const { setCurrentLanguage } = langSlice.actions;

export default langSlice.reducer;
