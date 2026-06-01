import {
	View,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	Pressable,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import { themeColor as themeColorSelector } from '../../store/features/settings/settings.selector';

import { useTheme } from '../../hooks/theme.hook';

import color from '../../theme/color';
import spacing, {pixelRatio as pixelRatioSpacing} from '../../theme/spacing';

import AppText from '../../components/AppText';
import BarLayout from '../../layouts/bar.layout';
import {Button} from '../../components/Button';
import { ThemeToggle } from '../../partials/theme/ThemeToggle';
import { LanguagePicker } from '../../partials/lang/LanguagePicker';
import { useTranslation } from 'react-i18next';

export default function WelcomeScreen({navigation}) {

	const { t } = useTranslation();

	const pixelRatio = pixelRatioSpacing()

	const themeColor = useSelector(themeColorSelector)

	const AppTextScaled = ({...props}) => <AppText themeColors={themeColor} scaled={true} {...props}/>

	const {activeTheme} = useTheme();

	const handleStartButton = (e) => {
		navigation.navigate('auth.register');
	};

	const goToLogin = () => {
		navigation.navigate('auth.login')
	}

	return (
		<SafeAreaView style={[
			{backgroundColor: themeColor["surface"]},
			styles.container
		]}>
			<BarLayout/>
			<ScrollView contentContainerStyle={styles.scrollContainer}>

				{/* ----- HEADER CONTENT ----- */}
				<View style={styles.headerContainer}>
					<View style={styles.brandContainer}>
						<View style={styles.logo}>
							<Icon
								name="diamond"
								size={24 * pixelRatio}
								color={themeColor["primary"]}
							/>
						</View>
						<AppTextScaled
							style={styles.brandText}
							font='medium'
							color="primary"
							size="3xl"
						>BonApp</AppTextScaled>
					</View>
					<ThemeToggle iconColor={themeColor["on-surface-variant"]}/>
				</View>



				{/* ----- BODY CONTENT ----- */}
				<View style={styles.bodyContainer}>
					<View>
						<AppTextScaled
							style={styles.captionSlogan}
							font='medium'
							color="primary"
							size="sm"
						>{t("guest.welcome.captionSlogan")}</AppTextScaled>
						<AppTextScaled
							style={[styles.captionTitle, {lineHeight: (4 + spacing.fontSize["6xl"]) * pixelRatio}]}
							font='semibold'
							color="on-background"
							size="6xl"
						>{t("guest.welcome.captionTitle")}</AppTextScaled>
						<AppTextScaled
							style={styles.captionDescription}
							font='light'
							color="on-surface-variant"
							size="2xl"
						>{t("guest.welcome.captionDescription")}</AppTextScaled>
					</View>
					<Button
						onPress={handleStartButton}
						backgroundColor={themeColor['primary-container']}
						style={styles.button}
						textProps={{
							font: "medium",
							size: "xl",
							style: {marginRight: 12},
							scaled: true
						}}
						rightContent={
							<Icon name="arrow-right-circle" size={spacing.fontSize["xl"] * pixelRatio} color="white"/>
						}
					>{t("guest.welcome.startButton")}</Button>
					<View style={styles.goToLoginContainer}>
						<AppTextScaled size="lg" color="on-surface-variant">{t("guest.welcome.alreadyAccount")} - </AppTextScaled>
						<Pressable onPress={goToLogin}>
							<AppTextScaled size="lg" font="semibold" color="on-surface-variant">{t("common:buttons.logIn")}</AppTextScaled>
						</Pressable>
					</View>
				</View>



				{/* ----- FOOT CONTENT ----- */}
				<View style={styles.footContainer}>
					<View style={[styles.line, {backgroundColor: themeColor["outline-variant"]}]}/>
					<View style={styles.terms}>
						<AppTextScaled size="sm" style={{marginRight: 28, textTransform: "uppercase"}} color='on-surface-variant' font='medium'>{t("common:terms.condition")}</AppTextScaled>
						<AppTextScaled style={{textTransform: "uppercase"}} color='on-surface-variant' font='medium'>{t("common:terms.confidentiality")}</AppTextScaled>
					</View>
					<AppTextScaled size="sm" style={styles.copyright} color='on-surface-variant' font='medium'>{t("common:copyright")}</AppTextScaled>
					<View style={{marginTop: 16, flexDirection: "row", justifyContent: "center"}}>
						<LanguagePicker
							iconColor={themeColor["on-surface-variant"]}
							iconSize={spacing.fontSize.sm}
							style={{
								paddingVertical: 12,
								paddingHorizontal: 24,
								borderColor: themeColor["outline-variant"],
								opacity: .5,
							}}
							buttonProps={{borderRadius: 14,}}
							buttonTextProps={{
								style: {color: themeColor["on-surface-variant"], textTransform: "uppercase"},
								size: "sm"
							}}
						/>
					</View>
				</View>

			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex:1,
	},
	scrollContainer: {
		flexGrow: 1,
		flexDirection: "column",
	},

	// HEADER
		headerContainer: {
			marginTop: 36,
			paddingHorizontal: 24,
			flexDirection: "row",
			justifyContent: "space-between",
		},
		brandContainer: {
			flexDirection: "row",
			alignItems: "center",
		},
		brandText: {
			letterSpacing: 3,
			textTransform: "uppercase",
		},
		logo: {
			marginRight: 8,
		},



	// BODY
		bodyContainer: {
			flexGrow: 1,
			marginVertical: 48,
			paddingHorizontal: 24,
		},
		captionSlogan: {
			opacity: .7,
			letterSpacing: 3,
			textTransform: "uppercase",
		},
		captionTitle: {
			marginTop: 16,
		},
		captionDescription: {
			marginTop: 20,
		},
		button: {
			marginTop: 48,
		},
		goToLoginContainer:{
			flexDirection: "row",
			alignItems:
			"center",
			justifyContent: "center",
			marginTop: 16
		},


	// FOOTER
		footContainer: {
			paddingHorizontal: 24,
			paddingBottom: 24,
		},
		terms: {
			width:"100%",
			flexWrap: "wrap",
			opacity: .5,
			flexDirection: "row",
			alignSelf: "center",
			justifyContent:"center",
			marginBottom: 16,
		},
		copyright: {
			opacity: .5,
			alignSelf: "center",
		},
		line: {
			opacity: .15,
			height: 1,
			borderRadius: 2,
			marginBottom: 36,
		},
});
