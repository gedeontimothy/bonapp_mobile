import { Text } from 'react-native';

import { Fonts } from '../theme/fonts';
import spacing, { scaledFontSize } from '../theme/spacing';
import baseColor from '../theme/color';

/**
 * Custom text component with support for colors,
 * responsive font sizes and custom fonts.
 *
 * @param {{
 * children?: React.ReactNode,
 * color?: 'primary' | 'primary-dark' | 'primary-dark-100' | 'primary-dark-200' | 'primary-dark-300' | 'primary-light' | 'primary-light-100' | 'primary-light-200' | 'primary-light-300' | 'primary-light-400' | 'primary-light-500' | 'secondary' | 'secondary-dark' | 'secondary-dark-100' | 'secondary-dark-200' | 'secondary-light' | 'secondary-light-100' | 'secondary-light-200' | 'secondary-light-300' | 'secondary-light-400' | 'secondary-light-500' | 'secondary-light-600' | 'tertiary' | 'tertiary-light' | 'tertiary-light-100' | 'tertiary-light-200' | 'tertiary-light-300' | 'tertiary-light-400' | 'tertiary-light-500' | 'tertiary-light-600' | 'tertiary-light-700' | 'tertiary-light-800' | 'tertiary-light-900' | 'neutral' | 'neutral-dark' | 'neutral-dark-100' | 'neutral-dark-200' | 'neutral-dark-300' | 'neutral-dark-400' | 'neutral-dark-500' | 'neutral-dark-600' | 'neutral-dark-700' | 'neutral-dark-800' | 'neutral-dark-900',
 * scaled?: boolean,
 * size?: '2xs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl',
 * font?: 'black' | 'blackitalic' | 'bold' | 'bolditalic' | 'extrabold' | 'extrabolditalic' | 'extralight' | 'extralightitalic' | 'italic' | 'light' | 'lightitalic' | 'medium' | 'mediumitalic' | 'regular' | 'semibold' | 'semibolditalic' | 'thin' | 'thinitalic',
 * style?: any,
 * themeColors?: object
 * }} props
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
