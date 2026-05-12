import {
	View,
	StyleSheet,
	SafeAreaView,
	ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import color from '../../theme/color';

import AppText from '../../components/AppText';
import BarLayout from '../../layouts/bar.layout';
import spacing, {pixelRatio as pixelRatioSpacing} from '../../theme/spacing';
import {Button} from '../../components/Button';

export default function WelcomeScreen({navigation}) {

	const pixelRatio = pixelRatioSpacing()

	const AppTextScaled = ({...props}) => <AppText scaled={true} {...props}/>

	return (
		<SafeAreaView style={styles.container}>
			<BarLayout/>
			<ScrollView contentContainerStyle={styles.scrollContainer}>

				{/* ----- HEADER CONTENT ----- */}
				<View style={styles.headerContainer}>
					<View style={styles.brandContainer}>
						<View style={styles.logo}>
							<Icon
								name="diamond"
								size={24 * pixelRatio}
								color={color.primary}
							/>
						</View>
						<AppTextScaled
							style={styles.brandText}
							font='medium'
							color="primary"
							size="3xl"
						>BONAPP</AppTextScaled>
					</View>
				</View>



				{/* ----- BODY CONTENT ----- */}
				<View style={styles.bodyContainer}>
					<View>
						<AppTextScaled
							style={styles.captionSlogan}
							font='regular'
							color="primary"
						>L'EXCELENCE FINANCIÈRE</AppTextScaled>
						<AppTextScaled
							style={[styles.captionTitle, {lineHeight: (4 + spacing.fontSize["6xl"]) * pixelRatio}]}
							font='semibold'
							color="black"
							size="6xl"
						>Bienvenue dans l'Atelier Financier.</AppTextScaled>
						<AppTextScaled
							style={styles.captionDescription}
							font='light'
							color="black"
							size="2xl"
						>Gérez vos bons de sortie de caisse avec une précision absolue. Une solution dédiée au suivi rigoureux de vos flux et retraits d'argent.</AppTextScaled>
					</View>
					<Button
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
					<View style={styles.line}/>
					<View style={styles.terms}>
						<AppTextScaled style={{marginRight: 28}} color='neutral-dark-600' font='medium'>CONFIDENTIALITÉ</AppTextScaled>
						<AppTextScaled color='neutral-dark-600' font='medium'>CONDITIONS</AppTextScaled>
					</View>
					<AppTextScaled color='neutral-dark-600' font='medium'>© 2024 BONAPP ATELIER</AppTextScaled>
				</View>

			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor: "white",
	},
	scrollContainer: {
		flexGrow: 1,
		flexDirection: "column",
	},

	// HEADER
		headerContainer: {
			marginTop: 36,
			paddingHorizontal: 24,
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
			flexDirection: "row",
			marginBottom: 16,
		},
		line: {
			backgroundColor: color['primary-light'],
			height: 1,
			borderRadius: 2,
			marginBottom: 36,
		},
});
