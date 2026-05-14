import { useEffect, useRef, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import Octicons from 'react-native-vector-icons/Octicons';

import { Button } from './Button';

import spacing, {pixelRatio as pixelRatioSpacing} from '../theme/spacing';
import { is_function } from '../utils/check';

export const Dropdown = ({
	children,

	pixelRatio,

	data = [],

	currentValue = null,
	onValueChange = null,

	keyResolver = null,
	valueResolver = null,
	labelResolver = null,
	
	buttonLeftContent,
	buttonRitghtContent,
	buttonTextProps = {},

	iconColor = "white",

	disabled,
	
	style = {},

	...props
}) => {
	const pickerRef = useRef();

	const open = () => {
		pickerRef.current.focus();
	}

	const pixelRatioLocal = pixelRatio || pixelRatioSpacing()

	const [label, setLabel] = useState(currentValue)

	useEffect(() => {
		if(is_function(labelResolver))
			setLabel(labelResolver(currentValue))
	}, [currentValue])

	return (
		<>
			<Button
				style={style}
				onPress={open}
				textProps={{
					font: "medium",
					...buttonTextProps,
					style: {
						marginRight: 8,
						...(buttonTextProps?.style ? buttonTextProps.style : {})
					},
				}}
				leftContent={buttonLeftContent}
				rightContent={
					buttonRitghtContent ||
					<Octicons
						name="chevron-down"
						size={spacing.fontSize["base"] * pixelRatioLocal}
						color={iconColor}
					/>
				}
				disabled={disabled}
			>{label}</Button>
			<Picker
				style={{display: "none"}}
				ref={pickerRef}
				selectedValue={currentValue}
				onValueChange={onValueChange}
				{...props}
			>
				{data.map((item, index) => {
					return (
						<Picker.Item
							key={keyResolver ? keyResolver(item, index) : index}
							value={valueResolver ? valueResolver(item, index) : item}
							label={labelResolver ? labelResolver(item) : item}
						/>
					);
				})}
			</Picker>
		</>
	);
}

// const styles = StyleSheet.create({});
