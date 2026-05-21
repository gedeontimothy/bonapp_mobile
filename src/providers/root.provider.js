import { AccessibilityInfo } from 'react-native';
import {useEffect, useState} from 'react'
import { Provider, useDispatch } from 'react-redux';

import {store} from '../store'
import { setAnimate } from '../store/features/settings/settings.slice';

import { initI18n } from '../i18n';

import BootLoadingScreen from '../screens/boot.loading.screen'
import { initLang } from '../store/features/lang/lang.slice';
import { activeLang } from '../store/features/lang/lang.selector';

import ThemeProvider from './theme.provider';
import RealmProvider from './realm.provider';

const Boot = ({children}) => {

	const [initialized, setInitialized] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {

		const call = async () => {
			accessibilityEventListenerThunk(dispatch);

			await dispatch(initLang());

			await initI18n(activeLang(store.getState()));

			setInitialized(true);
			console.log("root.provider")
		}

		call();

	}, []);

	if(initialized)
		return children;
	
	return;

};

const StopLoading = ({children, loading, stopLoading}) => {

	useEffect(() => {
		stopLoading();
	}, []);

	if(loading) return;

	return children; 
}

export default ({children}) => {

	const [loading, setLoading] = useState(true);

	const stopLoading = () => {
		setLoading(false);
	}

	return (
		<Provider store={store}>
			<Boot>
				<ThemeProvider>
					<RealmProvider>
						<StopLoading
							loading={loading}
							stopLoading={stopLoading}
						>
							{children}
						</StopLoading>
					</RealmProvider>
				</ThemeProvider>
			</Boot>
			{loading ? <BootLoadingScreen/> : null}
		</Provider>
	)
}

function accessibilityEventListenerThunk(dispatch) {

	AccessibilityInfo.addEventListener(
		'reduceMotionChanged',
		async () => dispatch(setAnimate(!await AccessibilityInfo.isReduceMotionEnabled()))
	);

};
