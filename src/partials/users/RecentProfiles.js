import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { themeColor as themeColorSelector } from "../../store/features/settings/settings.selector";

import { hexToRgba } from "../../utils/helpers";

import { Button } from "../../components/Button";
import { ProfileCard } from "../../components/UserCard";

export const RecentProfiles = ({
	onProfileChange,
	disabled = false,
	style = null,
	setProfileValue,
	profileValue,
}) => {
	const { t } = useTranslation();

	const themeColor = useSelector(themeColorSelector);

	const persistentUserExists = useSelector(state => state.auth.persistentUserExists);
	
	const [hiddenProfiles, setHiddenProfiles] = useState(true);

	const setProfileSelected = (profil) => {
		setProfileValue(profil);
	}

	const mockProfiles = [
		{"_id" : "xx", "username": "johndoe", "person" : {"displayName": "John Doe"}, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGhuAJ4Ha6SdyN6CeKzq6o4x1KI22vW3vuRFFRrt3O8YuiB-gSQdfiugTXyN8JoMj0YsOfH_D5y0eUaO-h0gMS1XX_SoT2iqwtuijuYrmRaGSSa0kldjtvEKi7wvuiDA6_O22msWeUnBSt9Sr7CUPK8rUfLNCXjQrRNns_uRauH2s6z004aLnx7LHNFa2NY9FCBuPlewShqR-SOCbJyU2-63LZlzRoA4km5ynhJXRh7hZgBwAGBaGZD7IHAX54txb5Rd8KWp_B0gc",},
		{"_id" : "xy", "username": "sandracelia", "person" : {"displayName": "Sandra Celia"}, avatar: null,},
	];

	return (
		<View style={style}>
			<View style={styles.viewButtonContainer}>
				<Button
					disabled={disabled || !persistentUserExists}
					onPress={() => setHiddenProfiles(!hiddenProfiles)}
					style={[
						{paddingHorizontal:16, paddingVertical: 8},
						hiddenProfiles
							? {
								borderColor: themeColor["surface-container-highest"],
								backgroundColor: "transparent",
								borderWidth: 2,
							}
							: {
								borderColor: hexToRgba(themeColor["inverse-surface"], .4),
								backgroundColor: themeColor["inverse-surface"],
								borderWidth: 3,
							},
						profileValue && hiddenProfiles
							? {backgroundColor: themeColor["surface-container-highest"], borderColor: themeColor["inverse-surface"]}
							: null,
					]}
					textProps={{color: hiddenProfiles
						? themeColor["on-surface"]
						: themeColor["inverse-on-surface"]
					}}
					backgroundColor="transparent"
					borderRadius={200}
				>{t('common:buttons.viewProfiles')}</Button>
			</View>
			{!hiddenProfiles && (
				<View>
					<View>
						{mockProfiles.map((data, index) => <ProfileCard
							key={index}
							style={{
								marginTop: 16,
								...(data._id == profileValue?._id
									? {
										borderColor: "red",
										borderWidth: 2,
									}
									: {padding:1}
								)
							}}
							hiddenDeleteButton={data._id == profileValue?._id}
							disabled={profileValue != null && data._id != profileValue?._id}
							avatar={data?.avatar}
							username={data.username}
							name={data.person.displayName}
							onPressDelete={() => {
								console.log("Delete profile>>>", data.username);
							}}
							onPress={() => {
								if(data._id == profileValue?._id)
									setProfileSelected(null);
								else
									setProfileSelected(data);

								if(onProfileChange)
									onProfileChange(data._id == profileValue?._id ? null : data)
							}}
						/>)}
					</View>
				</View>
			)}
		</View>
	)
};

const styles = StyleSheet.create({
	viewButtonContainer: {
		flexDirection: "row",
		justifyContent: "center",
	},
})