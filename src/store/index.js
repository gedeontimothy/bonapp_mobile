import {combineReducers, configureStore} from '@reduxjs/toolkit';

import settingsReducer from './features/settings/settings.slice';
import processReducer from './features/process/process.slice';

const rootReducer = combineReducers({
	settings: settingsReducer,
	process: processReducer,
});

export const store = configureStore({
	reducer: rootReducer,
});
