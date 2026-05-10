import {
	View,
	StyleSheet,
	SafeAreaView,
	ToastAndroid,
	Alert,
} from 'react-native';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import uuid from 'react-native-uuid'
import {Picker} from '@react-native-picker/picker';

import { changeLanguage, removeLangProcess } from '../../store/features/lang/lang.slice';
import { availableLanguages, countPendingLangProcessByActionType, currentLanguage, getLangProcess } from '../../store/features/lang/lang.selector';

import color from '../../theme/color';

import AppText from '../../components/AppText';
import { Fonts } from '../../theme/fonts';

export default function WelcomeScreen({navigation}) {

	const { t } = useTranslation();
	const dispatch = useDispatch();
	const store = useStore();

	const current_language = useSelector(currentLanguage);
	const languages = useSelector(availableLanguages);

	const handleLang = async (lang, ...e) => {
		const countChangeLanguageProcess = countPendingLangProcessByActionType("lang/changeLanguage")(store.getState());

		if(countChangeLanguageProcess > 0){
			ToastAndroid.show("On changing language, wait please...", ToastAndroid.LONG);
		}
		else{
			ToastAndroid.show("Change to \"" + t("lang." + lang) + "\" language", ToastAndroid.LONG);

			const code = uuid.v4();

			await dispatch(changeLanguage({
				language: lang,
				process: {code}
			}))

			const process = getLangProcess(code)(store.getState())

			if(process.error)
				Alert.alert(t("errors.base"), process.error);
			else
				ToastAndroid.show("Language changed to \"" + t("lang." + lang) + "\"", ToastAndroid.SHORT);

			dispatch(removeLangProcess({code}));
		}
	}

	const handleSelectChangeLanguage = (itemValue, itemIndex) => {
		if(itemValue != current_language) handleLang(itemValue)
	}


	return (
		<SafeAreaView style={styles.container}>
			<AppText size="3xl" scaled={true} color="black">{t('welcome')}</AppText>
			<View style={styles.langContainer}>
				<AppText scaled={true} size="xl" color="black">{t("lang.base")}</AppText>
				<View style={styles.pickerWrapper}>
					<Picker
						selectedValue={current_language}
						onValueChange={handleSelectChangeLanguage}
						style={styles.picker}
					>
						{languages.map(lang => {
							return (
								<Picker.Item style={styles.pickerItem} key={lang} label={t("lang." + lang)} value={lang} />
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
		color: "black",
	},
});
