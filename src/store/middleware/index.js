import { createListenerMiddleware } from '@reduxjs/toolkit';
import { loadUserProfile, setAuthProcess } from '../features/auth/auth.slice';
import { changeLanguage } from '../features/lang/lang.slice';
import { changeTheme } from '../features/settings/settings.slice';

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
	actionCreator: loadUserProfile.fulfilled,
	effect: async (action, {dispatch}) => {
		const {profile, code, autoState} = action.payload;

		await dispatch(changeLanguage({ language: profile.preferences.lang }));

		await dispatch(changeTheme({ theme: profile.preferences.theme }));

		if(code && autoState){
			setAuthProcess({code, processState: "fulfilled"});
		}

	}
});
