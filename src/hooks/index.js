import { createAsyncThunk, AsyncThunk, GetThunkAPI, AsyncThunkConfig } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { is_object } from '../utils/check';

// /**
//  * Creates an asynchronous thunk to retrieve data from AsyncStorage.
//  *
//  * @param {string} typePrefix - Prefix for the thunk type (ex: 'lang/initLang')
//  * @param {Array<string>} itemKeys - The data keys in AsyncStorage
//  * @param {import('@reduxjs/toolkit').AsyncThunkPayloadCreator} callback - Callback to process the recovered data(ex: `async (payload: Object, parsedData: any, thunkAPI: object, error: boolean | object, ...args) => parsedData`)
//  * @param {boolean} auto_reject - If true, the error will be rejected automatically
//  * 
//  * @returns {AsyncThunk<any, void, AsyncThunkConfig>}
//  */

/**
 * @template Returned
 * @template ThunkArg
 * @template RejectValue
 *
 * @param {string} typePrefix - Prefix for the thunk type (ex: 'lang/initLang')
 * @param {string[]} itemKeys - The data keys in AsyncStorage
 * @param {(
 *   arg: ThunkArg,
 *   data: Object,
 *   thunkAPI: import('@reduxjs/toolkit').GetThunkAPI<{
 *     rejectValue: RejectValue
 *   }>,
 *   error: false | Error
 * ) => Promise<Returned> | Returned} callback
 * @param {boolean} [auto_reject=true] - If true, the error will be rejected automatically
 *
 * @returns {import('@reduxjs/toolkit').AsyncThunk<
 *   Returned,
 *   ThunkArg,
 *   {
 *     rejectValue: RejectValue
 *   }
 * >}
 */
export function createStorageAsyncThunk(typePrefix, itemKeys, callback, auto_reject = true, ...args) {
	return createAsyncThunk(
		typePrefix,
		async (action, thunkAPI, ...extra_args) => {
			try {
				let parsedData = null;
				for(var itemKey of itemKeys){
					const storedData = await AsyncStorage.getItem(itemKey);
					parsedData =Object.assign(
						is_object(parsedData) ? parsedData : {},
						{[itemKey] : storedData ? JSON.parse(storedData) : null}
					)
				}
				return callback(action, parsedData , thunkAPI, false, ...extra_args);
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
