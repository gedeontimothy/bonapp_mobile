import { Image, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { Pressable } from "react-native";
import Octicons from 'react-native-vector-icons/Octicons';

import { themeColor as themeColorSelector } from "../store/features/settings/settings.selector";

import AppTextBase from "./AppText";

import spacing, {pixelRatio as pixelRatioSpacing} from '../theme/spacing';
import { Button } from "./Button";

/**
 * Displays a user profile card with an avatar, name, username,
 * and an optional delete button.
 *
 * @param {TComponentProfileCardProps} props
 * 
 * @returns {JSX.Element}
 */
export const ProfileCard = ({
	children,
	name,
	username,
	avatar = null,
	style = null,
	pixelRatio = null,
	disabled = false,
	onPressDelete = null,
	onPress = null,
	hiddenDeleteButton = false,
}) => {

	/** @type {TThemeBaseColor} */
	const themeColor = useSelector(themeColorSelector);

	const pixelRatioLocal = pixelRatio || pixelRatioSpacing()

	/**
	 * @param {TComponentAppTextProps} props
	 */
	const AppText = ({...props}) => <AppTextBase themeColors={themeColor} scaled {...props}/>

	const iconSize = spacing.fontSize["xl"] * pixelRatioLocal;

	return (
		<View style={[
			styles.container,
			{
				borderColor: themeColor['outline-variant'],
				backgroundColor: themeColor['surface-container-high'],
				opacity: disabled ? .5 : 1,
			},
			style
		]}>
			<Pressable
				onPress={onPress}
				disabled={disabled}
				style={styles.press}
			></Pressable>

			<View style={styles.contentContainer}>
				{avatar
					? <Image
						source={{ uri: avatar }}
						style={[
							styles.avatar,
							{
								backgroundColor: themeColor["surface-bright"],
								width: spacing.fontSize["6xl"] * pixelRatioLocal,
								height: spacing.fontSize["6xl"] * pixelRatioLocal,
							}
						]}
					/>
					: (
						<View style={[
							styles.avatar,
							styles.avatarIcon,
							{
								backgroundColor: themeColor["surface-bright"],
								width: spacing.fontSize["6xl"] * pixelRatioLocal,
								height: spacing.fontSize["6xl"] * pixelRatioLocal,
							},
						]}>
							<Octicons
								name="person"
								size={spacing.fontSize["xl"] * pixelRatioLocal}
								color={themeColor["on-surface"]}
							/>
						</View>
					)
				}

				<View style={{flexGrow:1}}>
					<AppText color={themeColor["on-surface"]}>{name}</AppText>
					<AppText size="sm" color={themeColor["on-surface-variant"]}>{username}</AppText>
				</View>

				{!hiddenDeleteButton && (
					<View>
						<Button
							onPress={onPressDelete}
							style={[
								{
									backgroundColor: themeColor["surface-container-highest"],
									width: iconSize + 15,
									height: iconSize + 15,
								},
								styles.deleteButton,
							]}
							disabled={disabled}
						>
							<Octicons
								name="trash"
								size={iconSize}
								color="red"
							/>
						</Button>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderRadius: 900,
		overflow: "hidden",
		position: "relative",
	},
	contentContainer: {
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
	},
	avatar: {
		zIndex: -1,
		borderRadius: 900,
		marginRight: 12,
		overflow: "hidden",
	},
	avatarIcon: {
		position: "relative",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	press: {
		position: "absolute",
		top: 0, left: 0,
		zIndex: 3,
		width: "100%", height: "100%",
	},
	deleteButton: {
		padding: 4,
		borderRadius: 100,
		zIndex: 4,
	},
});
