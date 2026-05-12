import { StatusBar } from "react-native";
import { useEffect } from "react";
import { useSelector, useStore } from "react-redux";

import { activeTheme, currentTheme } from "../store/features/settings/settings.selector";
import changeNavigationBarColor from "react-native-navigation-bar-color";

export default function BarLayout({children}){

	const current_theme = useSelector(currentTheme);

	const store = useStore();

	useEffect(() => {
		const active_theme = activeTheme(store.getState());
		
		StatusBar.setBackgroundColor(active_theme == "light" ? "white" : "black");
		
		StatusBar.setBarStyle(active_theme == "light" ? "dark-content" : "light-content");
		
		changeNavigationBarColor(
			active_theme == "light" ? "white" : "black",
			active_theme == "light"
		);

	}, [current_theme]);

	return (
		<>
			{children}
		</>
	);
}
