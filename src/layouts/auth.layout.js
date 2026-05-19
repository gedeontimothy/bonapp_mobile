import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import { themeColor as themeColorSelector } from "../store/features/settings/settings.selector";

import spacing, { pixelRatio as pixelRatioSpacing } from "../theme/spacing";

import AppTextBase from "../components/AppText";

import { ThemeToggle } from "../partials/theme/ThemeToggle";

import BarLayout from "./bar.layout";

/**
 * Authentication layout component used to wrap auth screens
 * with a consistent header, branding, caption, and scrollable content.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Screen content rendered inside the layout.
 * @param {Object|Array} [props.style] - Custom styles applied to the content container.
 * @param {string} props.captionTitle - Main title displayed in the header section.
 * @param {string} props.captionDescription - Description text displayed below the title.
 *
 * @returns {JSX.Element}
 */
export default function AuthLayout({
	children,
	style,
	captionTitle,
	captionDescription,
}){

	const { t } = useTranslation();
	
	const themeColor = useSelector(themeColorSelector);

	const pixelRatio = pixelRatioSpacing();

	const AppText = ({...props}) => <AppTextBase themeColors={themeColor} scaled={true} {...props}/>

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
						<AppText
							style={styles.brandText}
							font='medium'
							color="primary"
							size="3xl"
						>BonApp</AppText>
					</View>
					<ThemeToggle iconColor={themeColor["on-surface-variant"]}/>
				</View>

				<View style={styles.captionContainer}>
					<AppText
						style={[styles.captionTitle, {lineHeight: (4 + spacing.fontSize["4xl"]) * pixelRatio}]}
						font='semibold'
						color="on-background"
						size="4xl"
					>{captionTitle}</AppText>
					<AppText
						style={styles.captionDescription}
						font='light'
						color="on-surface-variant"
						size="lg"
					>{captionDescription}</AppText>
				</View>

				<View style={style}>
					{children}
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


	captionContainer: {
		// flexGrow: 1,
		marginVertical: 28,
		paddingHorizontal: 24,
	},
	captionTitle: {
		marginTop: 16,
		width: "65%"
	},
	captionDescription: {
		marginTop: 12,
	},
});
