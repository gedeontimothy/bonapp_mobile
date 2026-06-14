// =======================================================
// >>> COMPONENT PRIMITIVE PROPS
// =======================================================

/**
 * @typedef {null | ((event: import("react-native").GestureResponderEvent) => void) | undefined} TComponentPressableOnPressProp
 * Pressable onPress handler.
 */

/**
 * @typedef {import("react-native").StyleProp<import("react-native").ViewStyle> | undefined} TComponentViewStyleProp
 * View style used across components.
 */

/**
 * @typedef {TComponentViewStyleProp | ((state: import("react-native").PressableStateCallbackType) => import("react-native").StyleProp<import("react-native").ViewStyle>)} TComponentPressableStyleProp
 * Pressable style (static or dynamic).
 */

// =======================================================
// >>> APP TEXT
// =======================================================

/**
 * @typedef {Object} TComponentAppTextProps
 * Props for AppText component.
 * 
 * @property {import("react").ReactNode} children
 * @property {TThemeColorKey} color
 * @property {boolean} scaled
 * @property {'2xs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'} size
 * @property {TFonts} font
 * @property {import("react-native").StyleProp<import("react-native").TextStyle>} style
 * @property {TThemeBaseColor} themeColors
 */

// =======================================================
// >>> BUTTON
// =======================================================

/**
 * @typedef {Object} TComponentButtonLocalProps
 * Custom props for Button component.
 * 
 * @property {import("react").ReactNode} children 
 * @property {import("react").ReactNode} leftContent
 * @property {import("react").ReactNode} rightContent
 * @property {TComponentAppTextProps} textProps
 * @property {'primary' | 'primary-dark' | 'primary-dark-100' | 'primary-dark-200' | 'primary-dark-300' | 'primary-light' | 'primary-light-100' | 'primary-light-200' | 'primary-light-300' | 'primary-light-400' | 'primary-light-500' | 'secondary' | 'secondary-dark' | 'secondary-dark-100' | 'secondary-dark-200' | 'secondary-light' | 'secondary-light-100' | 'secondary-light-200' | 'secondary-light-300' | 'secondary-light-400' | 'secondary-light-500' | 'secondary-light-600' | 'tertiary' | 'tertiary-light' | 'tertiary-light-100' | 'tertiary-light-200' | 'tertiary-light-300' | 'tertiary-light-400' | 'tertiary-light-500' | 'tertiary-light-600' | 'tertiary-light-700' | 'tertiary-light-800' | 'tertiary-light-900' | 'neutral' | 'neutral-dark' | 'neutral-dark-100' | 'neutral-dark-200' | 'neutral-dark-300' | 'neutral-dark-400' | 'neutral-dark-500' | 'neutral-dark-600' | 'neutral-dark-700' | 'neutral-dark-800' | 'neutral-dark-900'} backgroundColor
 * @property {number} borderRadius
 * @property {TComponentPressableStyleProp} style
 */

/**
 * @typedef {import("react-native").PressableProps & TComponentButtonLocalProps} TComponentButtonProps
 * Button props with Pressable integration.
 */

// =======================================================
// >>> DROPDOWN
// =======================================================

/**
 * @typedef {Object} TComponentDropdownProps
 * Props for Dropdown component.
 * 
 * @property {import("react").ReactNode} children
 * @property {number} pixelRatio
 * @property {Array} data
 * @property {string} currentValue
 * @property {(itemValue: import("@react-native-picker/picker/typings/Picker").ItemValue, itemIndex: number) => void} onValueChange
 * @property {(item: any, index: number) => import("react").Key} keyResolver
 * @property {(item: any, index: number) => import("@react-native-picker/picker/typings/Picker").ItemValue} valueResolver
 * @property {(item: any, index: number) => string} labelResolver
 * @property {import("react").ReactNode} buttonLeftContent
 * @property {import("react").ReactNode} buttonRitghtContent
 * @property {TComponentAppTextProps} buttonTextProps
 * @property {import("react-native").ColorValue | number | undefined} iconColor
 * @property {number | undefined} iconSize
 * @property {boolean} disabled
 * @property {TComponentPressableStyleProp} style
 * @property {TComponentButtonProps} buttonProps
 * @property {TComponentPressableOnPressProp} onPress
 * 
 */

// =======================================================
// >>> FIELD
// =======================================================

/**
 * @typedef {Object} TComponentFieldLocalProps
 * Custom props for Field component.
 * 
 * @property {import("react").ReactNode} [children] - Child content displayed below the field.
 * @property {string} label - Field label.
 * @property {string} [holder] - Placeholder text.
 * @property {TComponentViewStyleProp} [style] - Custom container styles.
 * @property {string} [value] - Current field value.
 * @property {null | {message: string} | undefined} [error] - Error object that may contain a message.
 * @property {boolean} [disabled] - Disables input editing when true.
 * @property {import("react").ReactNode} [labelRightContent] - Element displayed on the right side of the label.
 */

/**
 * @typedef {import("react-native").TextInputProps & TComponentFieldLocalProps} TComponentFieldProps
 * Field props with TextInput integration.
 */

// >>> PinFiel

/**
 * @typedef {Object} TComponentPinFieldProps
 * Props for PIN input field.
 * 
 * @property {import("react").ReactNode} [children] - Child content displayed below the field.
 * @property {string} label - Field label.
 * @property {string} [value=""] - Current PIN value.
 * @property {Object} [error] - Error object that may contain a message.
 * @property {Object|Array} [style] - Custom container styles.
 * @property {number} [maxLength=6] - Maximum number of allowed digits.
 * @property {boolean} [disabled=false] - Disables input editing when true.
 * @property {import("react").ReactNode} [labelRightContent] - Element displayed on the right side of the label.
 * @property {TComponentAppTextProps} [labelProps={}] - Additional props passed to the label AppText component.
 * @property {boolean} [hidden=false] - Hidden value.
 * @property {null | import("react").RefObject | undefined} [pinInputRef=null]
 */

// =======================================================
// >>> Profile Card
// =======================================================

/**
 * Displays a user profile card with an avatar, name, username,
 * and an optional delete button.
 *
 * @typedef {Object} TComponentProfileCardProps
 * @property {string} name - Displayed name.
 * @property {string} username - Displayed username.
 * @property {?string} [avatar=null] - Avatar image URL.
 * @property {TComponentViewStyleProp} [style=null] - Additional styles.
 * @property {?number} [pixelRatio=null] - Custom scaling ratio.
 * @property {boolean} [disabled=false] - Disables interactions.
 * @property {TComponentPressableOnPressProp} [onPressDelete=null] - Delete button callback.
 * @property {TComponentPressableOnPressProp} [onPress=null] - Card press callback.
 * @property {boolean} [hiddenDeleteButton=false] - Hides the delete button.
 */
