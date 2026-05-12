import { AccessibilityInfo } from 'react-native';
import {useEffect, useState} from 'react'
import { Provider, useDispatch } from 'react-redux';

import {store} from '../store'
import { setAnimate } from '../store/features/settings/settings.slice';

import { initI18n } from '../config/i18n';

import BootLoadingScreen from '../screens/boot.loading.screen'
import { initLang } from '../store/features/lang/lang.slice';
import { activeLang } from '../store/features/lang/lang.selector';

import ThemeProvider from './theme.provider';

const Boot = ({children, positionProvider, stopLoading, providersCount}) => {

	const dispatch = useDispatch();


	useEffect(() => {
		const call = async () => {
			await accessibilityEventListenerThunk(dispatch);

			await dispatch(initLang());
			
			await initI18n(activeLang(store.getState()));

			stopLoading();
		}

		call();

	}, []);

	if(providersCount >= positionProvider)
		return children;
	
	return;

};

export default ({children}) => {
	const [loading, setLoading] = useState(true);

	const [providersCount, setProvidersCount] = useState(0); 

	const stopLoadingOn = 2;

	const incrementProvidersCount = () => setProvidersCount(providersCount + 1);

	useEffect(() => {
		if(stopLoadingOn == providersCount) setTimeout(() => setLoading(false), 500);
	}, [providersCount])

	return (
		<Provider store={store}>
			<Boot
				positionProvider={1}
				providersCount={providersCount}
				stopLoading={incrementProvidersCount}
			>
				<ThemeProvider
					positionProvider={2}
					providersCount={providersCount}
					stopLoading={incrementProvidersCount}
				>
					{children}
				</ThemeProvider>
			</Boot>
			{loading ? <BootLoadingScreen/> : null}
		</Provider>
	)
}

async function accessibilityEventListenerThunk(dispatch) {

	AccessibilityInfo.addEventListener(
		'reduceMotionChanged',
		async () => dispatch(setAnimate(!await AccessibilityInfo.isReduceMotionEnabled()))
	);

};
