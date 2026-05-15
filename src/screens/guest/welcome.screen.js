import {
	View,
	StyleSheet,
	SafeAreaView,
	ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import { themeColor as themeColorSelector } from '../../store/features/settings/settings.selector';

import { useTheme } from '../../hooks/theme';

import color from '../../theme/color';
import spacing, {pixelRatio as pixelRatioSpacing} from '../../theme/spacing';

import AppText from '../../components/AppText';
import BarLayout from '../../layouts/bar.layout';
import {Button} from '../../components/Button';
import { ThemeToggle } from '../../partials/theme/ThemeToggle';
import { LanguagePicker } from '../../partials/lang/LanguagePicker';

export default function WelcomeScreen({navigation}) {

	const pixelRatio = pixelRatioSpacing()

	const themeColor = useSelector(themeColorSelector)

	const AppTextScaled = ({...props}) => <AppText themeColors={themeColor} scaled={true} {...props}/>

	const {activeTheme} = useTheme();

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
						>BONAPP</AppTextScaled>
					</View>
					<ThemeToggle style={{marginRight: 30}} iconColor={themeColor["on-surface-variant"]}/>
				</View>



				{/* ----- BODY CONTENT ----- */}
				<View style={styles.bodyContainer}>
					<View>
						<AppTextScaled
							style={styles.captionSlogan}
							font='medium'
							color="primary"
							size="sm"
						>L'EXCELENCE FINANCIÈRE</AppTextScaled>
						<AppTextScaled
							style={[styles.captionTitle, {lineHeight: (4 + spacing.fontSize["6xl"]) * pixelRatio}]}
							font='semibold'
							color="on-background"
							size="6xl"
						>Bienvenue dans l'Atelier Financier.</AppTextScaled>
						<AppTextScaled
							style={styles.captionDescription}
							font='light'
							color="on-surface-variant"
							size="2xl"
						>Gérez vos bons de sortie de caisse avec une précision absolue. Une solution dédiée au suivi rigoureux de vos flux et retraits d'argent.</AppTextScaled>
					</View>
					<Button
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
					>Commencer l'aventure</Button>
				</View>



				{/* ----- FOOT CONTENT ----- */}
				<View style={styles.footContainer}>
					<View style={[styles.line, {backgroundColor: themeColor["outline-variant"]}]}/>
					<View style={styles.terms}>
						<AppTextScaled size="sm" style={{marginRight: 28}} color='on-surface-variant' font='medium'>CONFIDENTIALITÉ</AppTextScaled>
						<AppTextScaled color='on-surface-variant' font='medium'>CONDITIONS</AppTextScaled>
					</View>
					<AppTextScaled size="sm" style={styles.copyright} color='on-surface-variant' font='medium'>© 2024 BONAPP ATELIER</AppTextScaled>
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
								style: {color: themeColor["on-surface-variant"]},
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


	// FOOTER
		footContainer: {
			paddingHorizontal: 24,
			paddingBottom: 24,
		},
		terms: {
			opacity: .5,
			flexDirection: "row",
			alignSelf: "center",
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
