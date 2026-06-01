import { useSelector, useStore } from "react-redux";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, ToastAndroid, View } from "react-native";
import { Controller } from "react-hook-form";
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { themeColor as themeColorSelector} from "../../store/features/settings/settings.selector";

import { scaledFontSize } from "../../theme/spacing";
import useLoginForm from "../../forms/auth/login.form";

import AppTextBase from "../../components/AppText";
import { Field, PinField } from "../../components/Field";
import { Button } from "../../components/Button";

import AuthLayout from "../../layouts/auth.layout";
import { useEffect, useState } from "react";
import { useUser } from "../../hooks/user.hook";
import { RecentProfiles } from "../../partials/users/RecentProfiles";

export default function LoginScreen({children, navigation}) {

	const { t } = useTranslation();

	const store = useStore();

	const themeColor = useSelector(themeColorSelector);
	
	const persistentUserExists = useSelector(state => state.auth.persistentUserExists);

	const [currentProfileSelected, setCurrentProfileSelected] = useState(null);

	const [hiddenPin, setHiddenPin] = useState(true);

	const AppText = ({...props}) => <AppTextBase themeColors={themeColor} scaled={true} {...props}/>

	const form = useLoginForm();

	const { getAllUser } = useUser();

	const users = getAllUser();

	const onSubmit = async (data) => {
		console.log(data, users)
	};

	const goToRegister = () => {
		navigation.navigate("auth.register");
	}

	const mockProfiles = [
		{"_id" : "xx", "username": "johndoe", "person" : {"displayName": "John Doe"}, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGhuAJ4Ha6SdyN6CeKzq6o4x1KI22vW3vuRFFRrt3O8YuiB-gSQdfiugTXyN8JoMj0YsOfH_D5y0eUaO-h0gMS1XX_SoT2iqwtuijuYrmRaGSSa0kldjtvEKi7wvuiDA6_O22msWeUnBSt9Sr7CUPK8rUfLNCXjQrRNns_uRauH2s6z004aLnx7LHNFa2NY9FCBuPlewShqR-SOCbJyU2-63LZlzRoA4km5ynhJXRh7hZgBwAGBaGZD7IHAX54txb5Rd8KWp_B0gc",},
		{"_id" : "xy", "username": "sandracelia", "person" : {"displayName": "Sandra Celia"}, avatar: null,},
	];

	useEffect(() => {

		if(currentProfileSelected)
			form.setValue('username', currentProfileSelected.username);
		else if(currentProfileSelected?.username == form.getValues().username)
			form.setValue("username", "");

	}, [currentProfileSelected])

	return (
		<AuthLayout
			captionTitle={t("auth.register.captionTitle")}
			captionDescription={t("auth.register.captionDescription")}
			style={styles.container}
			footer={
				<View style={styles.footContainer}>
					<View style={[styles.line, {backgroundColor: themeColor["outline-variant"]}]}/>
					<View style={styles.footerContainerText}>
						<AppText
							size="2xs"
							style={styles.copyright}
							color='outline'
						>{t("common:copyright")}</AppText>
						<AppText
							size="2xs"
							style={styles.copyright}
							color='outline'
						>SECURITY VERIFIED</AppText>
					</View>
				</View>
			}
		>
			{persistentUserExists && (
				<RecentProfiles
					setProfileValue={setCurrentProfileSelected}
					profileValue={currentProfileSelected}
					style={styles.recentProfilesContainer}
					profiles={mockProfiles}
				/>
			)}
			<View>
				<View>
					<Controller
						control={form.control}
						name="username"
						render={({ field, fieldState }) => (
							<Field
								label={t("common:labels.username")}
								holder="Ex: jeandufau_02"
								style={{marginBottom: 20}}
								value={field.value}
								onChangeText={field.onChange}
								onBlur={field.onBlur}
								error={fieldState.error}
							/>
						)}
					/>
				</View>
				<View style={{borderRadius: 14, padding: 20, backgroundColor: themeColor["surface-container-low"]}}>
					<Controller
						control={form.control}
						name={"pin"}
						render={({ field, fieldState }) => (
							<PinField
								label={t("common:labels.pin")}
								hidden={hiddenPin}
								value={field.value}
								onChangeText={field.onChange}
								onBlur={field.onBlur}
								error={fieldState.error}
								labelRightContent={
									<Pressable onPress={() => setHiddenPin(hiddenPin ? false : true)}>
										<Octicons
											name={hiddenPin ? "eye" : "eye-closed"}
											size={scaledFontSize('xl')}
											color={themeColor["primary"]}
										/>
									</Pressable>
								}
							/>
						)}
					/>
					<View style={styles.pinInfoContainer}>
						<Octicons
							style={{position: "relative", top: 3}}
							name="info"
							size={scaledFontSize('lg')}
							color={themeColor["outline-variant"]}
						/>
						<AppText
							style={{marginLeft: 12, flex:1}}
							color={themeColor['on-surface-variant']}
							size="lg"
						>{t("common:actions.pinInfo", {max_number: 6})}</AppText>
					</View>
				</View>
				<Button
					style={{marginTop: 28}}
					onPress={form.handleSubmit(onSubmit)}
					backgroundColor={themeColor['primary-container']}
					textProps={{
						font: "medium",
						size: "lg",
						style: {marginRight: 12},
						scaled: true
					}}
					rightContent={
						<SimpleLineIcons
							name="arrow-right-circle"
							size={scaledFontSize('lg')}
							color="white"
						/>
					}
				>{t("common:buttons.logIn")}</Button>
				<View style={styles.goToRegisterContainer}>
					<AppText
						size="lg"
						color="on-surface-variant"
					>{t("auth.login.questionNew")} </AppText>
					<Pressable onPress={goToRegister}>
						<AppText
							size="lg"
							font="semibold"
							color="on-surface-variant"
						>{t("common:buttons.createAccount")}</AppText>
					</Pressable>
				</View>
			</View>
		</AuthLayout>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 24,
		paddingBottom: 24,
	},
	recentProfilesContainer: {
		marginBottom: 20,
	},
	pinInfoContainer: {
		flexDirection: "row",
		width: "100%",
		alignItems: "flex-start",
		marginTop: 20,
	},
	goToRegisterContainer:{
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 16,
	},

	footContainer: {
		paddingHorizontal: 24,
		paddingBottom: 24,
	},
	line: {
		opacity: .15,
		height: 1,
		borderRadius: 2,
		marginBottom: 16,
	},
	footerContainerText: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	copyright: {
		opacity: .5,
		alignSelf: "center",
		letterSpacing: 1.7,
	},
});
