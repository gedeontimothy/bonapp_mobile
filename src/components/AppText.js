import { Text } from 'react-native';

import { Fonts } from '../theme/fonts';
import spacing, { scaledFontSize } from '../theme/spacing';
import baseColor from '../theme/color';

export default function AppText({children, color, scaled = false, size, font, style, ...props}){
	return (
		<Text
			style={[
				{
					color: baseColor[color] ?? color,
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
