import { StatusBar } from "react-native";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { activeTheme as activeThemeSelector, currentTheme } from "../store/features/settings/settings.selector";
import changeNavigationBarColor from "react-native-navigation-bar-color";

export default function BarLayout({children}){
	
	const activeTheme = useSelector(activeThemeSelector);

	useEffect(() => {
		
		StatusBar.setBackgroundColor(activeTheme == "light" ? "white" : "black");
		
		StatusBar.setBarStyle(activeTheme == "light" ? "dark-content" : "light-content");
		
		changeNavigationBarColor(
			activeTheme == "light" ? "white" : "black",
			activeTheme == "light"
		);

	}, [activeTheme]);

	return (
		<>
			{children}
		</>
	);
}
