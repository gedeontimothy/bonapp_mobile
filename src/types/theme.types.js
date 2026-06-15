/**
 * @typedef {Object} TThemeColor
 * 
 * @property {string} primary
 * @property {string} primary-dark
 * @property {string} primary-dark-100
 * @property {string} primary-dark-200
 * @property {string} primary-dark-300
 * @property {string} primary-light
 * @property {string} primary-light-100
 * @property {string} primary-light-200
 * @property {string} primary-light-300
 * @property {string} primary-light-400
 * @property {string} primary-light-500
 * @property {string} secondary
 * @property {string} secondary-dark
 * @property {string} secondary-dark-100
 * @property {string} secondary-dark-200
 * @property {string} secondary-light
 * @property {string} secondary-light-100
 * @property {string} secondary-light-200
 * @property {string} secondary-light-300
 * @property {string} secondary-light-400
 * @property {string} secondary-light-500
 * @property {string} secondary-light-600
 * @property {string} tertiary
 * @property {string} tertiary-light
 * @property {string} tertiary-light-100
 * @property {string} tertiary-light-200
 * @property {string} tertiary-light-300
 * @property {string} tertiary-light-400
 * @property {string} tertiary-light-500
 * @property {string} tertiary-light-600
 * @property {string} tertiary-light-700
 * @property {string} tertiary-light-800
 * @property {string} tertiary-light-900
 * @property {string} neutral
 * @property {string} neutral-dark
 * @property {string} neutral-dark-100
 * @property {string} neutral-dark-200
 * @property {string} neutral-dark-300
 * @property {string} neutral-dark-400
 * @property {string} neutral-dark-500
 * @property {string} neutral-dark-600
 * @property {string} neutral-dark-700
 * @property {string} neutral-dark-800
 * @property {string} neutral-dark-900
 * 
 * @property {TThemeBaseColor} light
 * @property {TThemeBaseColor} dark
 */

/**
 * @typedef {Object} TThemeBaseColor
 * 
 * @property {string} surface
 * @property {string} surface-dim
 * @property {string} surface-bright
 * @property {string} surface-container-lowest
 * @property {string} surface-container-low
 * @property {string} surface-container
 * @property {string} surface-container-high
 * @property {string} surface-container-highest
 * @property {string} on-surface
 * @property {string} on-surface-variant
 * @property {string} inverse-surface
 * @property {string} inverse-on-surface
 * @property {string} outline
 * @property {string} outline-variant
 * @property {string} surface-tint
 * @property {string} primary
 * @property {string} on-primary
 * @property {string} primary-container
 * @property {string} on-primary-container
 * @property {string} inverse-primary
 * @property {string} secondary
 * @property {string} on-secondary
 * @property {string} secondary-container
 * @property {string} on-secondary-container
 * @property {string} tertiary
 * @property {string} on-tertiary
 * @property {string} tertiary-container
 * @property {string} on-tertiary-container
 * @property {string} error
 * @property {string} on-error
 * @property {string} error-container
 * @property {string} on-error-container
 * @property {string} primary-fixed
 * @property {string} primary-fixed-dim
 * @property {string} on-primary-fixed
 * @property {string} on-primary-fixed-variant
 * @property {string} secondary-fixed
 * @property {string} secondary-fixed-dim
 * @property {string} on-secondary-fixed
 * @property {string} on-secondary-fixed-variant
 * @property {string} tertiary-fixed
 * @property {string} tertiary-fixed-dim
 * @property {string} on-tertiary-fixed
 * @property {string} on-tertiary-fixed-variant
 * @property {string} background
 * @property {string} on-background
 * @property {string} surface-variant
 */

/**
 * @typedef {"surface" | "surface-dim" | "surface-bright" | "surface-container-lowest" | "surface-container-low" | "surface-container" | "surface-container-high" | "surface-container-highest" | "on-surface" | "on-surface-variant" | "inverse-surface" | "inverse-on-surface" | "outline" | "outline-variant" | "surface-tint" | "primary" | "on-primary" | "primary-container" | "on-primary-container" | "inverse-primary" | "secondary" | "on-secondary" | "secondary-container" | "on-secondary-container" | "tertiary" | "on-tertiary" | "tertiary-container" | "on-tertiary-container" | "error" | "on-error" | "error-container" | "on-error-container" | "primary-fixed" | "primary-fixed-dim" | "on-primary-fixed" | "on-primary-fixed-variant" | "secondary-fixed" | "secondary-fixed-dim" | "on-secondary-fixed" | "on-secondary-fixed-variant" | "tertiary-fixed" | "tertiary-fixed-dim" | "on-tertiary-fixed" | "on-tertiary-fixed-variant" | "background" | "on-background" | "surface-variant"} TThemeColorKey
 */

/**
 * @typedef {["light", "dark", "system"]} TThemes
 */

/**
 * @typedef {"light" | "dark" | "system"} TTheme
 */

/**
 * @typedef {"light" | "dark"} TThemeActive
 */

/**
 * @typedef {TThemeActive} TThemeScheme
 */

/**
 * @typedef {Object} TThemeState
 * 
 * @property {TThemeKey} [current]
 * @property {TSchemeTheme} [colorScheme]
 * @property {TTheme} [availableThemes]
 */

/**
 * @typedef {Object} TThemeSelectorState
 * 
 * @property {Object} settings
 * @property {TThemeState} [settings.theme]
 */

/**
 * @typedef {Object} TFonts
 * 
 * @property {string} black
 * @property {string} blackitalic
 * @property {string} bold
 * @property {string} bolditalic
 * @property {string} extrabold
 * @property {string} extrabolditalic
 * @property {string} extralight
 * @property {string} extralightitalic
 * @property {string} italic
 * @property {string} light
 * @property {string} lightitalic
 * @property {string} medium
 * @property {string} mediumitalic
 * @property {string} regular
 * @property {string} semibold
 * @property {string} semibolditalic
 * @property {string} thin
 * @property {string} thinitalic
 */
