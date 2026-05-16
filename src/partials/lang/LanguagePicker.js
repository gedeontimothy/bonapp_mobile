import { useState } from "react"
import { useTranslation } from "react-i18next";
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import spacing, { pixelRatio as pixelRatioSpacing } from "../../theme/spacing"

import { useLanguage } from "../../hooks/lang";

import { Dropdown } from "../../components/Dropdown"
import color from "../../theme/color";

export const LanguagePicker = ({
	style,
	iconColor,
	iconSize = null,
	buttonProps = {},
	buttonTextProps = {}
}) => {

	const { t } = useTranslation();

	const pixelRatio = pixelRatioSpacing()

	const {
		changeLanguage,
		changeLanguageLoading,
		currentLanguage : current_language,
		languages
	} = useLanguage();

	const handleSelectChangeLanguage = (language, itemIndex) => {
		if(language != current_language) {
			changeLanguage(language)
		}
	}

	return (
		<Dropdown
			style={[
				{
					backgroundColor: "transparent",
					borderWidth: 1.5,
					borderColor: color["primary-light-100"],
				},
				style
			]}
			currentValue={current_language}
			keyResolver={item => item}
			labelResolver={(lang) => t("lang." + lang)}
			onValueChange={handleSelectChangeLanguage}
			data={languages}
			buttonTextProps={{
				...buttonTextProps,
				style: {
					marginHorizontal: 8,
					color: color["neutral-dark-200"],
					...(buttonTextProps?.style ? buttonTextProps.style : {})
				},
				scaled: true,
			}}
			buttonLeftContent={
				<Icon
					name="globe"
					size={(iconSize ?? spacing.fontSize.base) * pixelRatio}
					color={iconColor || color["neutral-dark-200"]}
				/>
			}
			disabled={changeLanguageLoading}
			iconColor={iconColor || color["neutral-dark-200"]}
			iconSize={iconSize}
			pixelRatio={pixelRatio}
			buttonProps={{
				borderRadius: 20,
				...buttonProps
			}}
		/>
	)
}
