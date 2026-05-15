import { Appearance, useColorScheme } from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";

import { activeTheme, availableThemes, currentTheme } from "../store/features/settings/settings.selector";
import { initSettingTheme, setColorScheme } from "../store/features/settings/settings.slice";

const Boot = ({children, positionProvider, stopLoading, providersCount}) => {
	
	const dispatch = useDispatch();

	const store = useStore();

	const themes = useSelector(availableThemes);

	const colorScheme = useColorScheme()

	useEffect(() => {

		const subscription = Appearance.addChangeListener(({colorScheme}) => {
			const current_theme = currentTheme(store.getState());
			if(
				current_theme === 'system' &&
				themes.includes(colorScheme) &&
				activeTheme(store.getState()) !== colorScheme
			){
				dispatch(setColorScheme(colorScheme))
			}
		});
		
		const call = async () => {

			await dispatch(initSettingTheme({colorScheme}));

			stopLoading();

		}

		call();

		return () => {
			subscription.remove();
		}

	}, []);

	if(providersCount >= positionProvider)
		return children;

	return;
	
};

export default function ThemeProvider({children, positionProvider, stopLoading, providersCount}){
	return (
		<Boot 
			stopLoading={stopLoading}
			positionProvider={positionProvider}
			providersCount={providersCount}
		>
			{children}
		</Boot>
	);
}
