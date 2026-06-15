import { Text } from 'react-native';

import { Fonts } from '../theme/fonts';
import spacing, { scaledFontSize } from '../theme/spacing';
import baseColor from '../theme/color';

/**
 * Custom text component with support for colors,
 * responsive font sizes and custom fonts.
 *
 * @param {TComponentAppTextProps} props
 *
 * @returns {JSX.Element}
 */
export default function AppText({children, color, scaled = false, size, font, style, themeColors, ...props}){
	return (
		<Text
			style={[
				{
					color: themeColors && themeColors[color] ? themeColors[color] : (baseColor[color] ?? color),
					fontFamily: Fonts[font] ?? Fonts.regular,
					fontSize: scaled ? scaledFontSize(size) : (spacing.fontSize[size] ?? spacing.fontSize.base),
				},
				style,
			]}
			{...props}
		>
			{children}
		</Text>
	)
}
