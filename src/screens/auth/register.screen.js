import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Controller } from "react-hook-form";
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { themeColor as themeColorSelector} from "../../store/features/settings/settings.selector";

import { scaledFontSize } from "../../theme/spacing";
import useRegisterForm from "../../hooks/forms/register.form.hook";

import AppTextBase from "../../components/AppText";
import { Field, PinField } from "../../components/Field";
import { Button } from "../../components/Button";

import AuthLayout from "../../layouts/auth.layout";

export default function RegisterScreen({children}) {

	const { t } = useTranslation();

	const themeColor = useSelector(themeColorSelector)

	const AppText = ({...props}) => <AppTextBase themeColors={themeColor} scaled={true} {...props}/>

	const form = useRegisterForm();

	const onSubmit = async (data) => {
		console.log(data);
	};

	return (
		<AuthLayout
			captionTitle={t("auth.register.captionTitle")}
			captionDescription={t("auth.register.captionDescription")}
			style={styles.container}
		>
			<View
				style={[
					{
						backgroundColor: themeColor["surface-container-lowest"]
					},
					styles.formContainer
				]}
			>
				<View>
					{
						[
							{
								name : 'lastname',
								fieldProps : {
									label: t("common:labels.lastname"),
									holder: "Ex: Dufau",
								},
							},
							{
								name : "firstname",
								fieldProps : {
									label: t("common:labels.firstname"),
									holder: "Ex: Jean",
								},
							},
							{
								name : 'username',
								fieldProps : {
									label: t("common:labels.username"),
									holder: "Ex: jeandufau_02",
								},
							},
						].map((value, key) => (
							<Controller
								key={key}
								control={form.control}
								name={value.name}
								render={({ field, fieldState }) => (
									<Field
										{...value.fieldProps}
										style={[{marginBottom: 32}, value?.fieldProps?.style ?? {}]}
										value={field.value}
										onChangeText={field.onChange}
										onBlur={field.onBlur}
										error={fieldState.error}
									/>
								)}
							/>
						))
					}

				</View>
				<View style={{borderRadius: 14, padding: 20, backgroundColor: themeColor["surface-container-low"]}}>
					<Controller
						control={form.control}
						name={"pin"}
						render={({ field, fieldState }) => (
							<PinField
								label={t("common:labels.pin")}

								value={field.value}
								onChangeText={field.onChange}
								onBlur={field.onBlur}
								error={fieldState.error}
								labelRightContent={(
									<Octicons
										name="shield-lock"
										size={scaledFontSize('xl')}
										color={themeColor["primary"]}
									/>
								)}
							/>
						)}
					/>
					<View style={{flexDirection: "row", width: "100%", alignItems: "flex-start", marginTop: 20}}>
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
						>{t("auth.register.pinInfo", {max_number: 6})}</AppText>
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
				>{t("auth.register.button")}</Button>
			</View>
		</AuthLayout>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 24,
	},
	formContainer: {
		padding: 28,
		borderRadius: 8,
	},
});
