import {
	View,
	StyleSheet,
	SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {Picker} from '@react-native-picker/picker';

import color from '../../theme/color';

import { useTheme } from '../../hooks/theme';

import AppText from '../../components/AppText';
import { Fonts } from '../../theme/fonts';
import { useLanguage } from '../../hooks/lang';

export default function WelcomeScreen({navigation}) {

	const { t } = useTranslation();

	const {
		changeTheme,
		changeThemeLoading,
		colorScheme,
		currentTheme : current_theme,
		themes
	} = useTheme();

	const {
		changeLanguage,
		changeLanguageLoading,
		currentLanguage : current_language,
		languages
	} = useLanguage();

	const handleSelectChangeLanguage = (itemValue, itemIndex) => {
		if(itemValue != current_language) {
			changeLanguage(itemValue)
		}
	}

	const handleSelectChangeTheme = (itemValue, itemIndex) => {
		if(itemValue != current_theme) {
			changeTheme(itemValue)
		}
	}


	return (
		<SafeAreaView style={styles.container}>
			<AppText size="3xl" scaled={true} color="black">{t('welcome')}</AppText>
			<View style={styles.langContainer}>
				<AppText scaled={true} size="xl" color="black">{t("lang.base")}</AppText>
				<View style={styles.pickerWrapper}>
					<Picker
						enabled={!changeLanguageLoading}
						selectedValue={current_language}
						onValueChange={handleSelectChangeLanguage}
						style={styles.picker}
						dropdownIconColor={color["secondary-light-400"]}
					>
						{languages.map(lang => {
							return (
								<Picker.Item
									style={styles.pickerItem}
									key={lang}
									label={t("lang." + lang)}
									value={lang}
								/>
							)
						})}
					</Picker>
				</View>
			</View>
			<View style={styles.langContainer}>
				<AppText scaled={true} size="xl" color="black">{t("theme.base")}</AppText>
				<View style={styles.pickerWrapper}>
					<Picker
						enabled={!changeThemeLoading}
						selectedValue={current_theme}
						onValueChange={handleSelectChangeTheme}
						style={styles.picker}
						dropdownIconColor={color["secondary-light-400"]}
					>
						{themes.map(theme => {
							return (
								<Picker.Item
									style={styles.pickerItem}
									key={theme}
									label={t("theme." + theme) + (theme == 'system' 
										? " (" + t("theme." + colorScheme) + ")"
										: ""
									)}
									value={theme}
								/>
							)
						})}
					</Picker>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex:1,
	},
	langContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: color["secondary-light-100"]
	},
	pickerWrapper: {
		width: '50%',
		borderWidth: 2,
		borderColor: color["secondary-light-200"],
		borderRadius: 16,
	},
	picker: {
		width: '100%',
		color: "black",
	},
	pickerItem: { 
		fontFamily: Fonts.regular, 
		// color: "black",
	},
});
