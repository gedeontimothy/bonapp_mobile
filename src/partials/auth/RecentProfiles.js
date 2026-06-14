import { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, ToastAndroid, View } from "react-native";
import { useSelector, useStore } from "react-redux";
import { useTranslation } from "react-i18next";
import uuid from 'react-native-uuid';

import { themeColor as themeColorSelector, activeTheme as activeThemeSelector } from "../../store/features/settings/settings.selector";

import { hexToRgba } from "../../utils/helpers";

import { Button } from "../../components/Button";
import { ProfileCard } from "../../components/UserCard";
import { countProfiles as countProfilesSelector, getAuthProcess, profiles as profilesSelector } from "../../store/features/auth/auth.selector";
import { useAuth } from "../../hooks/auth.hook";

export const RecentProfiles = ({
	onProfileChange,
	setProfileValue,
	disabled = false,
	style = null,
	autoSwitch=true,
	selectAuthUserProfile=false,
	toggleHiddenButton=true,
}) => {
	const { t } = useTranslation();

	const store = useStore();

	/** @type {TThemeBaseColor} */
	const themeColor = useSelector(themeColorSelector);

	const activeTheme = useSelector(activeThemeSelector);

	const profiles = useSelector(profilesSelector);

	const countProfiles = useSelector(countProfilesSelector);


	const [loading, setLoading] = useState(false);

	const [hiddenProfiles, setHiddenProfiles] = useState(true);

	const [profileSelected, setProfileSelected] = useState(null);

	const {
		authenticate,
		switchUser,
		deleteAccount,
		isAuth,
		authOnProcessing,
		authProfile,
	} = useAuth();

	const _profiles = useMemo(() => {
		return profileSelected
			? (
				Object.values(profiles).sort((a, b) => {
					return profileSelected.user._id == b.user._id
						? 1
						: -1
					;
				})
			)
			: Object.values(profiles)
		;
	}, [profiles, profileSelected])

	const _setProfileSelected = (profile, switch_user=true) => {
		setProfileSelected(profile);
		if(setProfileValue) setProfileValue(profile);

		if(switch_user && profile && autoSwitch && profile?.preferences?.loginWithoutPin){
			if(!authOnProcessing && !loading){
				setLoading(true);
				if(!isAuth)
					authenticateProfile(profile)
				else
					switchProfile(profile);
			}
			else ToastAndroid.show(t("feedback:operation.alreadyInProgress"), ToastAndroid.LONG)
		}
	}

	const authenticateProfile = async (profile) => {
		const results = await authenticate(profile.user.username, null, {withProfile: true});

		if(results !== true)
			Alert.alert(t("errors:base"), results);

		setLoading(false);
	}

	const switchProfile = async (profile) => {

		const results = await switchUser({userId: profile.user._id});

		if(results !== true)
			Alert.alert(t("errors:base"), results);

		setLoading(false);
	}
	
	const handleDeleteProfile = (profile) => {
		Alert.alert(
			t("common:confirmations.profiles.delete.title", {name: profile?.user?.person.displayName}),
			t("common:confirmations.profiles.delete.message"),
			[
				{
					text: t("common:buttons.delete"),
					async onPress(){
						// prompt pin code needed !!!!
						console.warn("prompt pin code needed !!!! src\\partials\\users\\RecentProfiles.js")
						await deleteProfile("123456", profile.user._id);
					},
					style: "destructive"
				},
				{
					text: t("common:buttons.cancel"),
					onPress(){
						setLoading(false);
					},
					style: "cancel"
				},
			],
			{
				cancelable:true,
				userInterfaceStyle: activeTheme,
			},
		)
	}

	const deleteProfile = async (pin, userId) => {
		setLoading(true);
		const results = await deleteAccount({userId, pin});

		if(results?.error)
			Alert.alert(t("errors:error.title"), results.message);
		else
			ToastAndroid.show(t("feedback:users.deleted"), ToastAndroid.LONG);

		setLoading(false);
	};


	useEffect(() => {
		if(Object.values(profiles).length === 1){
			setHiddenProfiles(false)
		}

		if(selectAuthUserProfile && isAuth)
			_setProfileSelected(authProfile, false);
	})


	return (
		<View style={style}>
			{toggleHiddenButton && <View style={styles.viewButtonContainer}>
				<Button
					disabled={disabled || countProfiles == 0}
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
						profileSelected && hiddenProfiles
							? {backgroundColor: themeColor["surface-container-highest"], borderColor: themeColor["inverse-surface"]}
							: null,
					]}
					textProps={{color: hiddenProfiles
						? themeColor["on-surface"]
						: themeColor["inverse-on-surface"]
					}}
					backgroundColor="transparent"
					borderRadius={200}
				>{Object.values(profiles).length === 1 
					? t('common:buttons.currentProfiles')
					: t('common:buttons.viewProfiles')
				}</Button>
			</View>}
			{(!hiddenProfiles || !toggleHiddenButton) && (
				<View>
					<View>
						{_profiles.map((data, index) => <ProfileCard
							key={data.user._id}
							style={{
								marginTop: 16,
								...(data.user._id == profileSelected?.user?._id
									? {
										borderColor: "red",
										borderWidth: 2,
									}
									: {padding:1}
								)
							}}
							hiddenDeleteButton={
								data.user._id == profileSelected?.user?._id || 
								loading
							}
							disabled={
								disabled ||
								authOnProcessing ||
								loading
							}
							avatar={data?.user?.avatar}
							username={data.user.username}
							name={data.user.person.displayName}
							onPressDelete={(...args) => handleDeleteProfile(data, ...args)}
							onPress={() => {
								if(data.user._id == profileSelected?.user?._id)
									_setProfileSelected(null);
								else
									_setProfileSelected(data);

								if(onProfileChange)
									onProfileChange(data.user._id == profileSelected?.user?._id ? null : data)
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