import { StatusBar } from "react-native";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import changeNavigationBarColor from "react-native-navigation-bar-color";

import { activeTheme as activeThemeSelector, themeColor as themeColorSelector } from "../store/features/settings/settings.selector";

export default function BarLayout({children, barColor = null}){
	
	const activeTheme = useSelector(activeThemeSelector);

	const themeColor = useSelector(themeColorSelector)

	useEffect(() => {
		
		StatusBar.setBackgroundColor(barColor ? (themeColor[barColor] ?? barColor) : themeColor["surface"]);
		
		StatusBar.setBarStyle(activeTheme == "light" ? "dark-content" : "light-content");
		
		changeNavigationBarColor(
			barColor ? (themeColor[barColor] ?? barColor) : themeColor["surface"],
			activeTheme == "light"
		);

	}, [activeTheme]);

	return (
		<>
			{children}
		</>
	);
}
