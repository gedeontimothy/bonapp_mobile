import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Creates an asynchronous thunk to retrieve data from AsyncStorage.
 *
 * @param {string} typePrefix - Prefix for the thunk type (ex: 'lang/initLang')
 * @param {string} itemKey - The data key in AsyncStorage
 * @param {function} callback - Callback to process the recovered data(ex: `async (action: object, parsedData: string | null, thunkAPI: object, error: boolean | object, ...args) => parsedData`)
 * @param {boolean} auto_reject - If true, the error will be rejected automatically
 * 
 * @returns {function}
 */
export function createStorageAsyncThunk(typePrefix, itemKey, callback, auto_reject = true, ...args) {
	return createAsyncThunk(
		typePrefix,
		async (action, thunkAPI, ...extra_args) => {
			try {
				const storedData = await AsyncStorage.getItem(itemKey);
				const parsedData = storedData ? JSON.parse(storedData) : null;
				return callback(action, parsedData, thunkAPI, false, ...extra_args);
			} catch (error) {
				return auto_reject 
					? thunkAPI.rejectWithValue(error.message)
					: callback(action, undefined, thunkAPI, error, ...extra_args)
				;
			}
		},
		...args
	);
}
