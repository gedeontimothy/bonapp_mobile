import { PixelRatio } from "react-native";

const spacing = {
	fontSize: {
		"2xs": 10,
		xs: 12,
		sm: 13,
		base: 14,
		lg: 16,
		xl: 18,
		"2xl": 20,
		"3xl": 24,
		"4xl": 30,
		"5xl": 36,
		"6xl": 48
	}
};

export const pixelRatio = () => PixelRatio.getFontScale();

export const scaledFontSize = (font_size_key) => (spacing.fontSize[font_size_key] ?? spacing.fontSize.base) * pixelRatio();

export default spacing;
