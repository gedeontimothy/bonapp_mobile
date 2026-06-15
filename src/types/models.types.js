
// =======================================================
// >>> UserPerson Snapshot
// =======================================================

/**
 * @typedef {Object} UserPersonSnapshot
 * 
 * @property {string} displayName
 * @property {string} firstname
 * @property {string} lastname
 * @property {?string} [gender]
 */

// =======================================================
// >>> PERSON MODEL
// =======================================================

/**
 * @typedef {Object} PersonModelFormData
 * 
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} [middlename]
 * @property {?string} [gender]
 */

/**
 * @typedef {Object} PersonModel
 * 
 * @property {string} _id
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} [middlename]
 * @property {?string} [gender]
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {?string} [deletedAt]
 */

/**
 * @typedef {PersonModel & {
 *   _id: import('realm').BSON.UUID,
 *   createdAt: Date,
 *   updatedAt: Date,
 *   deletedAt: ?Date,
 * }} PersonModelNonSerializable
 */


// =======================================================
// >>> USER MODEL
// =======================================================

/**
 * @typedef {Object} UserModelFormData
 * 
 * @property {string} personId
 * @property {UserPersonSnapshot} person
 * @property {string} username
 * @property {string} pin
 * @property {?string} [email]
 */

/**
 * @typedef {Object} UserModel
 * 
 * @property {string} _id
 * @property {string} personId
 * @property {UserPersonSnapshot} person
 * @property {string} username
 * @property {string} pin
 * @property {?string} [email]
 * @property {?string} [emailVerifiedAt]
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {?string} [deletedAt]
 */

/**
 * @typedef {UserModel & {
 *   _id: import('realm').BSON.UUID,
 *   personId: import('realm').BSON.UUID,
 *   emailVerifiedAt: ?Date,
 *   createdAt: Date,
 *   updatedAt: Date,
 *   deletedAt: ?Date,
 * }} UserModelNonSerializable
 */
