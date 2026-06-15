/**
 * @typedef {Object} TAuthState
 * 
 * @property {?UserModel} user
 * @property {boolean} [persistentUserExists]
 * @property {TAuthUserProfiles} userProfiles
 * @property {boolean} userProfilesIsUpdated
 */

/**
 * @typedef {Object} TAuthSelectorState
 * @property {TAuthState} auth
 */

/**
 * @typedef {Object} TAuthUserProfilePreferences
 * 
 * @property {boolean} loginWithoutPin 
 * @property {string} lang
 * @property {TTheme} theme
 */

/**
 * @typedef {Object} TAuthUserProfile
 * 
 * @property {UserModel} user
 * @property {TAuthUserProfilePreferences} preferences
 */

/**
 * @typedef {{[userId: string]: TAuthUserProfile}} TAuthUserProfiles
 */
