import {combineReducers, configureStore} from '@reduxjs/toolkit';

import langReducer from './features/lang/lang.slice';
import settingsReducer from './features/settings/settings.slice';
import processReducer from './features/process/process.slice';

const rootReducer = combineReducers({
	settings: settingsReducer,
	lang: langReducer,
	process: processReducer,
});

export const store = configureStore({
	reducer: rootReducer,
});
