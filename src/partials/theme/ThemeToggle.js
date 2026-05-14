import { StyleSheet, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import { useTheme } from "../../hooks/theme"
import spacing, { pixelRatio as pixelRatioSpacing } from "../../theme/spacing";
import color from "../../theme/color";

import { Button } from "../../components/Button";

export const ThemeToggle = ({
	iconColor,
	style,
	...props
}) => {
	const {
		currentTheme,
		changeThemeLoading,
		changeTheme,
		themes,
	} = useTheme();

	const pixelRatio = pixelRatioSpacing();

	const iconSize = spacing.fontSize["3xl"] * pixelRatio;

	const icons = {
		"light": <Octicons
			name="sun"
			size={iconSize}
			color={iconColor || color["primary-dark-200"]}
		/>,
		"dark": <Octicons
			name="moon"
			size={iconSize}
			color={iconColor || color["primary-dark-200"]}
		/>,
		"system": <MaterialIcons
			name="brightness-4"
			size={iconSize}
			color={iconColor || color["primary-dark-200"]}
		/>,
	};

	const switchTheme = () => {

		const max = themes.length - 1;

		const currentIndex = themes.findIndex((theme) => theme == currentTheme);

		const nextIndex = currentIndex == max ? 0 : (currentIndex + 1);

		changeTheme(themes[nextIndex]);

	}

	return (
		<Button
			{...props}
			onPress={switchTheme}
			style={[
				{width: iconSize + 10, height: iconSize + 10},
				styles.button,
				style
			]}
			disabled={changeThemeLoading}
		>
			{icons[currentTheme]}
		</Button>
	);
}

const styles = StyleSheet.create({
	button: {
		padding: 0,
		borderRadius: 100,
		backgroundColor: "transparent",
	},
});
