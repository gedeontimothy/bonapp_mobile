import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { builProcessThunks } from '../process/process.slice';
import { createStorageAsyncThunk } from '../../../hooks';
import { is_string } from '../../../utils/check';
import UserMapper from '../../../database/mappers/UserMapper';

const initialState = {
	user: null,
	persistentUserExists: false,
};

export const authSlice = createSlice({
	name: 'auth',

	initialState,

	reducers: {

		/**
		 * Set user state.
		 * 
		 * @param {Object} state 
		 * @param {Object} action 
		 */
		setUser(state, action){
			state.user = action.payload;
		},

		/**
		 * Set state of persistent user exists.
		 * 
		 * @param {Object} state 
		 * @param {Object} action 
		 */
		setPersistentUserExists(state, action){
			state.persistentUserExists = action.payload;
		}

	},
	extraReducers: (builder) => {
		builder
			.addCase(initAuth.fulfilled, (state, action) => {
				const {
					persistentUserExists,
					currentUser
				} = action?.payload ?? {};

				if(currentUser)
					authSlice.caseReducers.setUser(state, {payload: currentUser});

				if(persistentUserExists)
					authSlice.caseReducers.setPersistentUserExists(state, {payload : true});
			})
		;

		builder
			.addCase(authenticate.fulfilled, (state, action) => {
				authSlice.caseReducers.setUser(state, {payload : action.payload});
				authSlice.caseReducers.setPersistentUserExists(state, {payload : true});
			})
		;

		builder
			.addCase(logout.fulfilled, (state, action) => {
				authSlice.caseReducers.setUser(state, {payload : null});
			})
		;
	},

});

/**
 * Authenticate user.
 * 
 * @param {Object} options
 * @param {Object} [options.user]
 * @param {?string} [options.processCode=null]
 * @param {boolean} [options.autoState=true]
 * 
 * @returns {AsyncThunk}
 */
export const authenticate = createAsyncThunk(
	"auth/authenticate",
	async ({user, processCode = null, autoState = true}, {dispatch, rejectWithValue, requestId}) => {
		const code = processCode ?? uuid.v4();

		dispatch(addAuthProcess({
			code,
			requestId,
			actionType: "auth/authenticate",
		}));

		try {
			await AsyncStorage.setItem('store.auth.username', JSON.stringify(user.username));
		} catch (error) {
			dispatch(setAuthProcess({
				code,
				error: error.message,
				...(autoState ? {processState: "rejected"} : {})
			}));
			return rejectWithValue(error.message);
		}

		if(autoState)
			dispatch(setAuthProcess({
				code,
				processState: "fulfilled",
			}));

		return {
			...user,
			email_verified_at : user.email_verified_at?.toISOString(),
			createdAt : user.createdAt?.toISOString(),
			updatedAt : user.updatedAt?.toISOString(),
		};
	}
);

/**
 * Logout.
 * 
 * @param {Object} options
 * @param {Object} [options.user]
 * @param {?string} [options.processCode=null]
 * @param {boolean} [options.autoState=true]
 * 
 * @returns {AsyncThunk}
 */
export const logout = createAsyncThunk(
	"auth/logout",
	async ({processCode = null, autoState = true}, {dispatch, rejectWithValue, requestId}) => {
		const code = processCode ?? uuid.v4();

		dispatch(addAuthProcess({
			code,
			requestId,
			actionType: "auth/logout",
		}));

		try {
			await AsyncStorage.removeItem('store.auth.username');
		} catch (error) {
			dispatch(setAuthProcess({
				code,
				error: error.message,
				...(autoState ? {processState: "rejected"} : {})
			}));
			return rejectWithValue(error.message);
		}
		
		if(autoState)
			dispatch(setAuthProcess({
				code,
				processState: "fulfilled",
			}));

		return true;
	}
)

export const {
	addProcess: addAuthProcess,
	setProcess: setAuthProcess,
	setProcessState: setAuthProcessState,
	removeProcess: removeAuthProcess,
	markPendingProcessState: markPendingAuthProcessState,
	markRejectedProcessState: markRejectedAuthProcessState,
	markFulfilledProcessState: markFulfilledAuthProcessState,
} = builProcessThunks("auth");

/**
 * Initialize auth theme.
 *
 * @returns {Function}
 */
export const initAuth = createStorageAsyncThunk(
	'auth/initAuth',
	['store.auth.username'],
	async ({users, processCode = null, autoState = true}, data, {rejectWithValue, getState, requestId, dispatch}, error) => {
		const code = processCode ?? uuid.v4();

		const username = data?.['store.auth.username'];

		let user = null;

		dispatch(addAuthProcess({
			code,
			actionType: "auth/initAuth",
			requestId,
		}));

		if(error){
			dispatch(setAuthProcess({
				code,
				error : error.message,
				...(autoState
					? {processState: "rejected"}
					: {}
				),
			}));

			return rejectWithValue(error.message)
		}

		
		if(is_string(username)){
			const foundUser = users.filter((u) => u.username == username);
			if(foundUser.length > 0)
				user = foundUser[0];
		}

		if(autoState)
			dispatch(setAuthProcess({
				code,
				processState: "fulfilled",
			}));

		return {
			currentUser : UserMapper.toDTO(user),
			persistentUserExists: users.length > 1
		};
	},
	false
);


export const { setUser } = authSlice.actions;

export default authSlice.reducer;
