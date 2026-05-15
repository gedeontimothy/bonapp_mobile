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
	onPress,
	...props
}) => {
	const {
		currentTheme,
		changeThemeLoading,
		changeTheme,
		themes,
		activeTheme
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

	const nextTheme = () => {
		const max = themes.length - 1;

		const currentIndex = themes.findIndex((theme) => theme == currentTheme);

		return currentIndex == max ? 0 : (currentIndex + 1);
	}

	const switchTheme = () => {

		changeTheme(themes[nextTheme()]);

	}

	return (
		<Button
			{...props}
			onPress={onPress ? (...args) => onPress({
				nextTheme: nextTheme(),
				currentTheme,
				activeTheme,
				switchTheme
			}, ...args) : switchTheme}
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
