import { AccessibilityInfo } from 'react-native';
import React, {useEffect, useState} from 'react'
import { Provider, useDispatch } from 'react-redux';

import {store} from '../store'
import { setAnimate } from '../store/features/settings/settings.slice';

import { initI18n } from '../config/i18n';

import BootLoadingScreen from '../screens/boot.loading.screen'
import { initLang } from '../store/features/lang/lang.slice';

const Boot = ({children}) => {
	const [loading, setLoading] = useState(true);

	const dispatch = useDispatch();

	useEffect(() => {
		const call = async () => {
			await accessibilityEventListenerThunk(dispatch);

			await initI18n(store.getState().lang.currentLanguage);

			await dispatch(initLang());

			setTimeout(() => {
				setLoading(false);
			}, 500)
		}

		call();

	}, []);

	if(loading) return <BootLoadingScreen/>;

	return children
};

export default ({children}) => {
	return (
		<Provider store={store}>
			<Boot>
				{children}
			</Boot>
		</Provider>
	)
}

async function accessibilityEventListenerThunk(dispatch) {

	AccessibilityInfo.addEventListener(
		'reduceMotionChanged',
		async () => dispatch(setAnimate(!await AccessibilityInfo.isReduceMotionEnabled()))
	);

};
