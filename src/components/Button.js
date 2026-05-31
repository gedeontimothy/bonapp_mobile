import { Pressable, StyleSheet } from "react-native"
import baseColor from '../theme/color';
import AppText from "./AppText";
import { pixelRatio } from "../theme/spacing";

/**
 * Custom button component with optional left/right content
 * and configurable background color.
 *
 * @param {{
 * children?: React.ReactNode,
 * leftContent?: React.ReactNode,
 * rightContent?: React.ReactNode,
 * textProps?: Object,
 * backgroundColor?: 'primary' | 'primary-dark' | 'primary-dark-100' | 'primary-dark-200' | 'primary-dark-300' | 'primary-light' | 'primary-light-100' | 'primary-light-200' | 'primary-light-300' | 'primary-light-400' | 'primary-light-500' | 'secondary' | 'secondary-dark' | 'secondary-dark-100' | 'secondary-dark-200' | 'secondary-light' | 'secondary-light-100' | 'secondary-light-200' | 'secondary-light-300' | 'secondary-light-400' | 'secondary-light-500' | 'secondary-light-600' | 'tertiary' | 'tertiary-light' | 'tertiary-light-100' | 'tertiary-light-200' | 'tertiary-light-300' | 'tertiary-light-400' | 'tertiary-light-500' | 'tertiary-light-600' | 'tertiary-light-700' | 'tertiary-light-800' | 'tertiary-light-900' | 'neutral' | 'neutral-dark' | 'neutral-dark-100' | 'neutral-dark-200' | 'neutral-dark-300' | 'neutral-dark-400' | 'neutral-dark-500' | 'neutral-dark-600' | 'neutral-dark-700' | 'neutral-dark-800' | 'neutral-dark-900',
 * borderRadius?: number
 * style?: Object,
 * }} props
 *
 * @returns {JSX.Element}
 */
export const Button = ({children, leftContent = null, rightContent = null, textProps = {}, backgroundColor = null, borderRadius = 8, style = {}, disabled = false, ...props}) => {
	return (
		<Pressable
			style={[
				styles.button,
				{
					borderRadius: borderRadius * pixelRatio(),
					backgroundColor: backgroundColor == null 
						? baseColor["primary-light-500"]
						: (baseColor[backgroundColor] ?? backgroundColor)
					,
					opacity: disabled ? .3 : 1,
				},
				style,
			]}
			disabled={disabled}
			{...props}
		>
			{leftContent}
			<AppText
				color="white"
				{...textProps}
			>
				{children}
			</AppText>
			{rightContent}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		padding: 16,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	}
});
