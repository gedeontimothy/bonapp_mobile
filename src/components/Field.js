import { StyleSheet, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";

import { hexToRgba } from "../utils/helpers";

import { themeColor as themeColorSelector } from "../store/features/settings/settings.selector";

import AppText from "./AppText";
import { Fonts } from "../theme/fonts";
import spacing, { scaledFontSize } from "../theme/spacing";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Custom input field component based on TextInput.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Child content displayed below the field.
 * @param {string} props.label - Field label.
 * @param {string} [props.holder] - Placeholder text.
 * @param {Object|Array} [props.style] - Custom container styles.
 * @param {string} [props.value] - Current field value.
 * @param {Object} [props.error] - Error object that may contain a message.
 * @param {boolean} [props.disabled=false] - Disables input editing when true.
 * @param {React.ReactNode} [props.labelRightContent=null] - Element displayed on the right side of the label.
 * @param {...Object} props - Additional props passed to the TextInput.
 *
 * @returns {JSX.Element}
 */
export function Field({
	children,
	label,
	holder,
	style,
	value,
	error,
	disabled = false,
	labelRightContent = null,
	...props
}) {

	const themeColor = useSelector(themeColorSelector);

	const [focused, setFocused] = useState(false);

	return (
		<View style={[styles.container, style]}>
			<View style={[styles.labelContainer]}>
				<AppText
					scaled={true}
					color={themeColor["on-surface-variant"]}
				>{label}</AppText>
				{labelRightContent}
			</View>
			{error
				? (
					<AppText
						style={styles.error}
						scaled={true}
						color={themeColor["on-primary-fixed-variant"]}
					>{error.message}</AppText>
				) : null
			}
			<View>
				<TextInput
					{...props}

					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}

					value={value}

					editable={!disabled}

					placeholder={holder}
					placeholderTextColor={hexToRgba(themeColor["outline-variant"], .5)}

					style={[
						styles.textInput,
						{
							color: themeColor["on-background"],
							borderBottomColor: error ? "red" : (focused
								? themeColor["outline-variant"]
								: hexToRgba(themeColor["outline-variant"], .3)
							),
						},
						props?.style ?? {}
					]}
				/>
			</View>
		</View>
	);
}

/**
 * Custom PIN input field with visual digit rendering.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Child content displayed below the field.
 * @param {string} props.label - Field label.
 * @param {string} [props.value=""] - Current PIN value.
 * @param {Object} [props.error] - Error object that may contain a message.
 * @param {Object|Array} [props.style] - Custom container styles.
 * @param {number} [props.maxLength=6] - Maximum number of allowed digits.
 * @param {boolean} [props.disabled=false] - Disables input editing when true.
 * @param {React.ReactNode} [props.labelRightContent] - Element displayed on the right side of the label.
 * @param {Object} [props.labelProps={}] - Additional props passed to the label AppText component.
 * @param {boolean} [props.hidden=false] - Hidden value.
 * @param {...Object} props - Additional props passed to the hidden TextInput.
 *
 * @returns {JSX.Element}
 */
export function PinField({
	children,
	label,
	value = "",
	error,
	style,
	maxLength = 6,
	disabled = false,
	labelRightContent,
	labelProps={},
	hidden = false,
	pinInputRef=null,
	...props
}) {
	const themeColor = useSelector(themeColorSelector);

	const [focused, setFocused] = useState(false);

	const inputRef = pinInputRef ?? useRef(null)

	const pinArray = useMemo(() => {
		return Array.from({ length: maxLength }, (_, i) =>
			value?.[i] ?? null
		);
	}, [value, maxLength]);

	const renderPin = (char, index, ) => {
		const pointer = focused && index === value.length;
		if(inputRef.current?.blur && char && (index + 1) == maxLength)
			inputRef.current.blur();

		const isCharAndHidden = char && hidden;

		return (
			<View key={index} style={styles.pinContainer}>
				<AppText
					color={themeColor["on-background"]}
					size="2xl"
					font="semibold"
					style={{
						...(isCharAndHidden || !char
							? {
								borderRadius: 100,
								width: pointer ? "50%" : "35%",
								height: pointer ? "50%" : "35%",
								backgroundColor: pointer || isCharAndHidden
									? themeColor["outline-variant"]
									: hexToRgba(themeColor["outline-variant"], 0.3),
							}
							: {position: "relative", bottom: 3,}
						),
						...(isCharAndHidden
							? {
								backgroundColor: themeColor["outline-variant"],
								borderColor: themeColor["on-background"],
								borderWidth: 3,
								width: "65%",
								height: "65%",
							}
							: {}
						)
					}}
				>{hidden ? "" : char}</AppText>
			</View>
		)
	};

	return (
		<View style={[styles.container, style]}>
			<View style={[styles.labelContainer]}>
				<AppText
					scaled
					font="medium"
					color={themeColor["on-surface-variant"]}
					{...labelProps}
					style={[{marginRight: labelRightContent ? 8 : 0}, labelProps?.style ?? {}]}
				>
					{label}
				</AppText>
				{labelRightContent}
			</View>

			{error?.message ? (
				<AppText
					style={styles.error}
					scaled
					color={themeColor["on-primary-fixed-variant"]}
				>
					{error.message}
				</AppText>
			) : null}

			<View
				style={[
					styles.pinArea,
					{
						borderBottomColor: focused
							? themeColor["outline-variant"]
							: hexToRgba(themeColor["outline-variant"], 0.3),
					},
				]}
			>
				<View style={styles.pinRow}>
					{pinArray.map(renderPin)}
				</View>

				<TextInput
					{...props}
					ref={props?.ref ?? inputRef}
					value={value}
					editable={!disabled}
					keyboardType="numeric"
					maxLength={maxLength}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					style={styles.hiddenInput}
				/>
			</View>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},

	labelContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	error: {
		marginTop: 4,
	},

	pinArea: {
		position: "relative",
		overflow: "hidden",
		borderBottomWidth: 2,
	},

	textInput: {
		fontFamily: Fonts.medium,
		borderBottomWidth: 1,
	},

	pinRow: {
		// padding: 20,
		paddingVertical: 20,
		paddingHorizontal: 8,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	pinContainer: {
		width: spacing.fontSize['3xl'],
		height: spacing.fontSize['3xl'],
		justifyContent: "center",
		alignItems: "center",
		overflow: "visible",
	},

	hiddenInput: {
		opacity: 0,
		position: "absolute",
		left: 0,
		bottom: 0,
		width: "100%",
		height: "100%",
		zIndex: 2,
	},
});
