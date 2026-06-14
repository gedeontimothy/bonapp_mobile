import { useSelector, useStore } from "react-redux";
import { useEffect, useRef, useState } from "react";
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
import { useAuth } from "../../hooks/auth.hook";
import { RecentProfiles } from "../../partials/auth/RecentProfiles";
import { countProfiles as countProfilesSelector } from "../../store/features/auth/auth.selector";

export default function LoginScreen({children, navigation}) {

	const { t } = useTranslation();

	const store = useStore();

	const themeColor = useSelector(themeColorSelector);
	
	const countProfiles = useSelector(countProfilesSelector);

	const [currentProfileSelected, setCurrentProfileSelected] = useState(null);

	const [hiddenPin, setHiddenPin] = useState(true);

	const [loading, setLoading] = useState(false);

	const pinFieldRef = useRef(null);

	const {authOnProcessing, authenticate} = useAuth();

	const AppText = ({...props}) => <AppTextBase themeColors={themeColor} scaled={true} {...props}/>

	const form = useLoginForm();

	const onSubmit = (data) => {
		if(!authOnProcessing && !loading){

			setLoading(true);

			requestAnimationFrame(async () => {

				const results = await authenticate(data.username, data.pin);
	
				if(results !== true)
					Alert.alert(t('errors:base'), results);
	
				setLoading(false);

			})

		}
		else ToastAndroid.show(t("feedback:operation.alreadyInProgress"), ToastAndroid.LONG)
	};

	const goToRegister = () => {
		navigation.navigate("auth.register");
	}

	useEffect(() => {
		if(currentProfileSelected && currentProfileSelected?.user?.username){
			form.setValue('username', currentProfileSelected.user.username);
			if(pinFieldRef.current.focus && currentProfileSelected?.preferences?.loginWithoutPin)
				pinFieldRef.current.focus();
		}
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
			{countProfiles > 0 && (
				<RecentProfiles
					disabled={loading}
					setProfileValue={setCurrentProfileSelected}
					style={styles.recentProfilesContainer}
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
								pinInputRef={pinFieldRef}
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
					disabled={authOnProcessing || loading}
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
