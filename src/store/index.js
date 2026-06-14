import {combineReducers, configureStore} from '@reduxjs/toolkit';

import langReducer from './features/lang/lang.slice';
import settingsReducer from './features/settings/settings.slice';
import processReducer from './features/process/process.slice';
import usersReducer from './features/users/users.slice';
import authReducer from './features/auth/auth.slice';
import { listenerMiddleware } from './middleware';

const rootReducer = combineReducers({
	settings: settingsReducer,
	lang: langReducer,
	process: processReducer,
	auth: authReducer,

	users: usersReducer,
});

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().prepend(listenerMiddleware.middleware)
	,
});
