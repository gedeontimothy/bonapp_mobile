import { Pressable, StyleSheet } from "react-native"
import baseColor from '../theme/color';
import AppText from "./AppText";
import { pixelRatio } from "../theme/spacing";

/**
 * Custom button component with optional left/right content
 * and configurable background color.
 *
 * @param {TComponentButtonProps} props
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
