import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { builProcessThunks } from '../process/process.slice';
import { createStorageAsyncThunk } from '../../../hooks';
import { is_string } from '../../../utils/check';
import UserMapper from '../../../database/mappers/UserMapper';
import { currentUserPreferences, isAuth, profile as profileSelector, profileExists, authProfile, profiles } from './auth.selector';
import { filterObject } from '../../../utils/helpers';
import i18next from 'i18next';

const initialState = {
	user: null,
	persistentUserExists: false,
	userProfiles: {},
	userProfilesIsUpdated : true,
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
		},

		/**
		 * Set all stored user profiles.
		 * 
		 * @param state 
		 * @param action 
		 */
		setUserProfiles(state, action){
			state.userProfiles = action.payload;
		},

		/**
		 * Add or set a user profile to the profiles collection.
		 * 
		 * @param state 
		 * @param {{
		 *   payload: {
		 *     user: Object,
		 *     preferences: {
		 *       loginWithoutPin: boolean,
		 *       theme: TThemeKey,
		 *       lang: string,
		 *     }
		 *   }
		 * }} action 
		 * 
		 * @returns {void}
		 */
		setUserProfile(state, action){
			state.userProfiles[action.payload.user._id] = action.payload;
		},

		/**
		 * Merge new data into an existing user profile.
		 * 
		 * @param state 
		 * @param {{
		 *   userId: string,
		 *   data: {
		 *     user: Object,
		 *     preferences: Object
		 *   }
		 * }} action
		 * 
		 * @returns {void}
		 */
		updateUserProfile(state, action){
			Object.assign(
				state.userProfiles[action.payload.userId],
				action.payload.data
			);
		},

		/**
		 * Update the synchronization status of stored user profiles.
		 * 
		 * When set to:
		 * - `true`: profiles are considered synchronized with persistent storage.
		 * - `false`: profiles contain local changes that still need to be persisted.
		 * 
		 * @param state 
		 * @param {{payload: boolean}} action 
		 */
		setUserProfilesIsUpdated(state, action){
			state.userProfilesIsUpdated = action.payload;
		},

		/**
		 * Delete user profile.
		 * 
		 * @param state
		 * @param {Object} action 
		 * @param {string} [action.payload]
		 */
		deleteProfile(state, action){
			if(state.userProfiles?.[action.payload])
				delete state.userProfiles[action.payload];
		}

	},
	extraReducers: (builder) => {
		builder
			.addCase(initAuth.fulfilled, (state, action) => {
				const {
					persistentUserExists,
					currentUser,
					profiles,
				} = action?.payload ?? {};

				if(currentUser)
					authSlice.caseReducers.setUser(state, {payload: currentUser});

				if(persistentUserExists)
					authSlice.caseReducers.setPersistentUserExists(state, {payload : true});

				if(profiles)
					authSlice.caseReducers.setUserProfiles(state, {payload: profiles});
			})
		;

		builder
			.addCase(authenticate.fulfilled, (state, action) => {
				authSlice.caseReducers.setUser(state, {payload : action.payload.data});
				authSlice.caseReducers.setPersistentUserExists(state, {payload : true});
			})
		;

		builder
			.addCase(logout.fulfilled, (state, action) => {
				authSlice.caseReducers.setUser(state, {payload : null});
			})
		;

		builder
			.addCase(syncUserProfiles.fulfilled, (state, action) => {
				authSlice.caseReducers.setUserProfilesIsUpdated(state, {payload: true});
			})
		;

		builder
			.addCase(setUserProfile.fulfilled, (state, action) => {
				const {
					profile_exists,
					data,
					userId,
					sync
				} = action.payload;
				
				if(profile_exists){
					authSlice.caseReducers.updateUserProfile(state, {payload: {
						userId,
						data
					}});
				}
				else authSlice.caseReducers.setUserProfile(state, {payload: data});

				if(!sync){
					authSlice.caseReducers.setUserProfilesIsUpdated(state, {payload: false})
				}
			})
		;

		builder
			.addCase(deleteProfile.fulfilled, (state, action) => {
				authSlice.caseReducers.deleteProfile(state, {payload: action.payload.userId});
			})
		;
	},

});

/**
 * Synchronize user profiles with persistent storage.
 * 
 * @param {Object} [payload={}]
 * 
 * @param {?Object} [payload.data=null] - Profile collection to persist. When omitted, the current profiles stored in the auth state are used.
 * @param {boolean} [payload.force=null] - Forces synchronization even if profiles are already marked as synchronized.
 * @param {{
 *   processCode: string,
 *   processState: string,
 *   autoState: boolean
 * }} [payload.process={}]
 * 
 * @returns {Promise<{error: boolean | Object, message: string} | boolean>}
 */
export const syncUserProfiles = createAsyncThunk(
	'auth/syncUserProfiles',
	async function (
		{
			data=null,
			force=false,
			process = {},
		} = {},
		{dispatch, getState, rejectWithValue, requestId}
	){
		const {processCode, processState="pending", autoState=true} = process ?? {};

		if(processCode) dispatch(addAuthProcess({
			code: processCode,
			actionType: "auth/syncUserProfiles",
			processState,
			requestId,
		}));

		const state = getState();

		try {
			if(!state.auth.userProfilesIsUpdated || force){
				await AsyncStorage.setItem(
					'store.auth.user.profiles',
					JSON.stringify(data ?? state.auth.userProfiles)
				);
			}
			else{
				const message = i18next.t("feedback:operation.noChanges");

				if(processCode)
					dispatch(setAuthProcess({
						code: processCode,
						error: message,
						...(autoState ? {processState: "rejected"} : {})
					}))

				console.warn("store/auth/syncUserProfiles", message);
				return rejectWithValue({error: true, message});
			}
			
		} catch (error) {
			if(processCode)
				dispatch(setAuthProcess({
					code: processCode,
					error: error.message,
					...(autoState ? {processState: "rejected"} : {})
				}))
			console.error("store/auth/syncUserProfiles", error);
			return rejectWithValue({error, message: error.message});
		}

		if(processCode && autoState)
			dispatch(setAuthProcess({
				code: processCode,
				processState: "fulfilled",
			}));

		return true;

	}
);

/**
 * Delete user profile.
 * 
 * @param {Object} options
 * @param {string} [options.userId]
 * @param {{
 *   processCode: string,
 *   processState: string | undefined,
 *   autoState: boolean | undefined
 * }} [options.process={}]
 * 
 * @returns {AsyncThunk}
 */
export const deleteProfile = createAsyncThunk(
	'auth/deleteProfile',
	async function(
		{
			userId,
			process={}
		},
		{getState, rejectWithValue, dispatch, rejectId}
	) {
		const {processCode, processState="pending", autoState=true} = process ?? {};

		if(processCode) dispatch(addAuthProcess({
			code: processCode,
			actionType: "auth/deleteProfile",
			rejectId,
			processState,
		}));

		const state = getState();

		if(profileExists(userId)(state)){

			const results = await dispatch(syncUserProfiles({
				force: true,
				data: filterObject(profiles(state), (profile, user_id) => user_id != userId),
			})).unwrap();

			if(results !== true && results.error){
				if(processCode) dispatch(setAuthProcess({
					code: processCode,
					error: results.message,
					...(autoState ? {processState: "rejected"} :{})
				}));

				console.warn("store/auth/deleteProfile", results);
				return results;
			}

			if(processCode && autoState)
				dispatch(setAuthProcess({
					code: processCode,
					processState: "fulfilled",
				}))

			return {error: false, userId};
		}

		const error_message = i18next.t("errors:users.account.notExists");

		if(processCode) dispatch(setAuthProcess({
			code: processCode,
			error: error_message,
			...(autoState ? {processState: "rejected"} :{})
		}));

		console.warn("store/auth/deleteProfile", error_message);
		return rejectWithValue({error: true, message: error_message});
		
	}
);

/**
 * Create or update a user profile.
 * 
 * @param {{
 *   preferences: Object,
 *   user: Object,
 *   sync: boolean
 * }} payload
 * 
 * @returns {Promise<Object>}
 */
export const setUserProfile = createAsyncThunk(
	'auth/setUserProfile',
	async function(
		{
			preferences,
			user = null,
			sync = true,
		},
		{getState, rejectWithValue, dispatch}
	){
		const state = getState();

		const auth_user = user ?? (isAuth(state) ? state.auth.user : null);

		if(user){
			
			const user_id = auth_user._id;

			const profile_exists = profileExists(user_id)(state);

			const data = {
				user: auth_user,
				preferences,
			};

			const merged_data = {
				...state.auth.userProfiles,
				[user_id]: data,
			};

			if(sync) await dispatch(syncUserProfiles({
				force: true,
				data: merged_data
			}));

			return {
				error: false,
				profile_exists,
				data,
				sync, 
			}

		}

		const error_message = i18next.t("errors:users.account.notExists");

		console.warn("store/auth/setUserProfile", error_message);
		return rejectWithValue({error: true, message: error_message});
	}
);

/**
 * Synchronize a profile's preferences with the current application preferences.
 * 
 * @param {{
 *   userId: ?string
 * }} [options={}]
 * 
 * @returns {Promise<Object>}
 */
export const syncUserProfilePreferences = createAsyncThunk(
	'auth/syncUserProfilePreferences',
	async function(
		{
			userId = null,
		} = {},
		{dispatch, rejectWithValue, getState},
	){

		const state = getState();

		const profile = userId ? (profileSelector(userId)(state) ?? null) : authProfile(state)

		if(profile){
			const old_preferences = profile.preferences;

			const new_preferences = Object.assign(
				currentUserPreferences(state),
				{}
			);

			const preferences = {
				...old_preferences,
				...new_preferences,
			};

			const results = await dispatch(setUserProfile({user: profile.user, preferences})).unwrap();

			if(results.error){
				console.warn("store/auth/syncUserProfilePreferences", results);
				return rejectWithValue(results)
			}

			return results;
		}

		const error_message = i18next.t("errors:profiles.notExists");

		console.warn("store/auth/syncUserProfilePreferences", error_message);
		return rejectWithValue({error: true, message: error_message})

	}
);

/**
 * Update a user profile using its identifier.
 * 
 * @param {{
 *   preferences: Object,
 *   userId: string, 
 * }}
 * 
 * @returns {Promise<Object>}
 */
export const setUserProfileByUserId = createAsyncThunk(
	'auth/setUserProfile',
	async function({
		preferences,
		userId,
	}, {getState, dispatch, rejectWithValue}){

		const state = getState();

		const profile = state.auth.userProfiles?.[userId] ?? null; 

		if(profile){
			const results = await dispatch(setUserProfile({user: profile.user, preferences})).unwrap();

			if(results.error){
				console.warn("store/auth/setUserProfile", results);
				return rejectWithValue(results)
			}

			return results;

		}

		const error_message = i18next.t("errors:profiles.notExists");

		console.warn("store/auth/setUserProfile", error_message);
		return rejectWithValue({error: true, message: error_message})

	}
);

/**
 * Initialize a profile for a user.
 * 
 * @param {Object} options
 * @param {Object} options.user - User for which the profile should be created.
 * @param {boolean} [options.loginWithoutPin=true] - Initial value of the loginWithoutPin preference.
 * 
 * @returns {Promise<Object>}
 */
export const initUserProfile = createAsyncThunk(
	'auth/initUserProfile',
	async function(
		{user, loginWithoutPin=true},
		{dispatch, getState, rejectWithValue}
	){
		const state = getState();

		const profile_exists = profileExists(user._id)(state);

		if(!profile_exists){
			const results = await dispatch(setUserProfile({
				user,
				preferences: Object.assign(
					currentUserPreferences(state),
					{loginWithoutPin}
				),
			})).unwrap()

			if(results.error){
				console.warn("store/", results);
				return rejectWithValue(results);
			}

			return results;
		}

		const error_message = i18next.t("errors:profiles.alreadyExistsForUser", {username: user.username});

		console.warn("store/auth/initUserProfile", error_message);

		return rejectWithValue({error: true, message: error_message})
	}
);

/**
 * Load a user profile from the Redux store.
 * 
 * @param {Object} options
 * @param {?Object} [options.user=null] - User whose profile should be loaded.
 * @param {{
 *   processCode: string,
 *   processState: string,
 *   autoState: boolean,
 * }} [options.process={}]
 */
export const loadUserProfile = createAsyncThunk(
	'auth/loadUserProfile',
	async function (
		{
			user = null,
			process = {}
		},
		{getState, dispatch, rejectWithValue, requestId}
	){
		const {processCode, processState="pending", autoState=true} = process;

		if(processCode){
			dispatch(addAuthProcess({
				code: processCode,
				actionType: "auth/loadUserProfile",
				processState,
				requestId,
			}))
		}

		const state = getState();

		const auth_user = user ?? (isAuth(state) ? state.auth.user : null);

		const profile = profileSelector(auth_user && auth_user?._id ? auth_user._id : '')(state); 

		if(profile){

			if(processCode && autoState)
				dispatch(setAuthProcess({
					code: processCode,
					processState: "fulfilled",
				}));

			return  {
				profile,
				code: processCode,
				autoState,
				error: false,
			}
		}

		const error_message = i18next.t("errors:profiles.notExists");

		console.warn("store/auth/loadUserProfile", error_message);

		return rejectWithValue({error: true, message: error_message});
		
	}
);

/**
 * Authenticate user.
 * 
 * @param {Object} options
 * @param {Object} [options.user]
 * @param {?string} [options.processCode=null]
 * @param {boolean} [options.autoState=true]
 * 
 * @returns {Promise<AsyncThunk>}
 */
export const authenticate = createAsyncThunk(
	"auth/authenticate",
	async ({user, loginWithoutPin=true, processCode = null, autoState = true}, {dispatch, getState, rejectWithValue, requestId}) => {
		const code = processCode ?? uuid.v4();

		dispatch(addAuthProcess({
			code,
			requestId,
			actionType: "auth/authenticate",
		}));

		try {
			await AsyncStorage.setItem('store.auth.username', JSON.stringify(user.username));

			const state = getState();

			if(!profileExists(user._id)(state)){
				await dispatch(initUserProfile({
					user,
					loginWithoutPin,
				}));
			}
			else{
				await dispatch(loadUserProfile({user}));
			}

		} catch (error) {
			dispatch(setAuthProcess({
				code,
				error: error.message,
				...(autoState ? {processState: "rejected"} : {})
			}));
			console.error('store/auth/authenticate', error);
			return rejectWithValue({error, message: error.message});
		}

		if(autoState)
			dispatch(setAuthProcess({
				code,
				processState: "fulfilled",
			}));

		return {error: false, data: user};
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
 * @returns {Promise<AsyncThunk>}
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

			console.error('store/auth/logout', error);
			return rejectWithValue({error, message: error.message});
		}
		
		if(autoState)
			dispatch(setAuthProcess({
				code,
				processState: "fulfilled",
			}));

		return {error: false, data: true};
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
 * Initialize auth.
 *
 * @returns {Function}
 */
export const initAuth = createStorageAsyncThunk(
	'auth/initAuth',
	['store.auth.username', 'store.auth.user.profiles'],
	async ({users, processCode = null, autoState = true}, data, {rejectWithValue, requestId, dispatch}, error) => {
		const code = processCode ?? uuid.v4();

		const username = data?.['store.auth.username'];

		const profiles = data?.['store.auth.user.profiles'];

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

			console.warn("auth/initAuth", error);
			return rejectWithValue({error, message: error.message})
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
			error: false,
			currentUser : user,
			profiles,
			persistentUserExists: users.length > 0
		};
	},
	false
);


export const { setUser } = authSlice.actions;

export default authSlice.reducer;
