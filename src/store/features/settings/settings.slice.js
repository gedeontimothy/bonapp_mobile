import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStorageAsyncThunk } from '../../../hooks';
import { is_string } from '../../../utils/check';
import { availableThemes, isCurrentTheme, otherAvailableThemes } from './settings.selector';
import i18next from 'i18next';
import { builProcessThunks } from '../process/process.slice';

const initialState = {
	animate : true,
	theme : {
		current: "system",
		colorScheme: "light",
		availableThemes: ["light", "dark", "system"],
	},
};

export const settingsSlice = createSlice({
	name: 'settings',

	initialState,

	reducers: {

		/**
		 * Set animation.
		 *
		 * @param state
		 * @param {Object} action
		 * @param {boolean} action.payload - animate value
		 */
		setAnimate(state, action){
			state.animate = action.payload;
		},

		/**
		 * Set current theme.
		 *
		 * @param state
		 * @param {Object} action
		 * @param {TTheme} action.payload - animate value
		 */
		setCurrentTheme(state, action){
			state.theme.current = action.payload;
		},

		/**
		 * Set color scheme.
		 *
		 * @param state
		 * @param {Object} action
		 * @param {TThemeScheme} action.payload - animate value
		 */
		setColorScheme(state, action){
			state.theme.colorScheme = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(initSettingTheme.fulfilled, (state, action) => {
				if(is_string(action.payload?.currentTheme)){
					settingsSlice.caseReducers.setCurrentTheme(state, {payload: action.payload.currentTheme});
				}

				if(is_string(action.payload?.colorScheme)){
					settingsSlice.caseReducers.setColorScheme(state, {payload: action.payload.colorScheme});
				}
			})
		;

		builder
			.addCase(changeTheme.fulfilled, (state, action) => {
				if(is_string(action.payload)){
					settingsSlice.caseReducers.setCurrentTheme(state, {payload: action.payload});
				}
			})
		;
	}
});

/**
 * Initialize setting theme.
 * 
 * @type {import('@reduxjs/toolkit').AsyncThunk<
 *   {
 *     colorScheme: TThemeScheme,
 *     currentTheme: TTheme
 *   },
 *   {colorScheme: TThemeScheme},
 *   {rejectedValue: ({
 *     error: Object | boolean,
 *     message: string,
 *     code: string,
 *     theme: TTheme,
 *   })}
 * >}
 */
export const initSettingTheme = createStorageAsyncThunk(
	'settings/initSettingTheme',
	['store.settings.theme'],
	async ({colorScheme}, data, {rejectWithValue, getState}, error) => {
		if(error !== false){
			return rejectWithValue(error.message);
		}

		const themes = availableThemes(getState());

		if(is_string(data?.['store.settings.theme']) && !themes.includes(data['store.settings.theme'])){
			return rejectWithValue(i18next.t(
				"theme:errors.notAvailable",
				{theme: i18next.t("theme:" + data['store.settings.theme'])}
			))
		}

		return {colorScheme, currentTheme : data?.['store.settings.theme']};
	},
);

/**
 * Change current Theme.
 * 
 * @type {import('@reduxjs/toolkit').AsyncThunk<
 *   TTheme,
 *   {theme: TTheme, process: Object},
 *   {rejectedValue: ({
 *     error: Error | boolean,
 *     message: string,
 *     code: string,
 *     theme: TTheme,
 *   })}
 * >}
 */
export const changeTheme = createAsyncThunk(
	'settings/changeTheme',
	async ({theme, process = null}, { rejectWithValue, getState, dispatch, requestId }) => {
		const {code, processState = "pending", autoState = true} = process ?? {};

		try {

			if(code){
				dispatch(addSettingProcess({
					code,
					actionType : "settings/changeTheme",
					processState: processState,
					requestId,
				}))
			}

			const themes = otherAvailableThemes(getState())
			
			const error = isCurrentTheme(theme)(getState()) 
				? i18next.t(
					"theme:errors.already",
					{theme: i18next.t("theme:" + theme)}
				) : (!themes.includes(theme)
					? i18next.t(
						"theme:errors.notAvailable",
						{theme: i18next.t("theme:" + theme)}
					) : null
				)
			;

			if(error){
				if(code) dispatch(setSettingProcess({
					code,
					error,
					...(!autoState
						? {} 
						: {processState: "rejected"}
					),
				}));

				return rejectWithValue({
					error: true,
					message: error,
					code,
					theme,
				});

			}

			await AsyncStorage.setItem('store.settings.theme', JSON.stringify(theme));

			if(code) dispatch(setSettingProcess({
				code,
				...(!autoState
					? {}
					: {processState: "fulfilled"}
				),
			}));

			return theme;

			
		} catch (error) {
			const message = error.message;

			console.error(e);

			if(code) dispatch(setLangProcess({
				code,
				error: message,
				...(!autoState ? {} : {processState: "rejected"}),
			}));

			return rejectWithValue({
				error,
				message,
				code,
				theme,
			});
			
		}
	}
);

export const {
	addProcess: addSettingProcess,
	setProcess: setSettingProcess,
	setProcessState: setSettingProcessState,
	removeProcess: removeSettingProcess,
	markPendingProcessState: markPendingSettingProcessState,
	markRejectedProcessState: markRejectedSettingProcessState,
	markFulfilledProcessState: markFulfilledSettingProcessState,
} = builProcessThunks("settings");

export const { setAnimate, setCurrentTheme, setColorScheme } = settingsSlice.actions;

export default settingsSlice.reducer;
