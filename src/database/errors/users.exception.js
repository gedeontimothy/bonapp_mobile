/**
 * Error thrown when a user cannot be found in the database.
 */
export class UserNotExistsError extends Error {
	constructor() {
		super(`User not exits`);
		this.name = 'UserNotExistsError';
	}
}

/**
 * Error thrown when a username is already in use.
 */
export class UsernameAlreadyExistsError extends Error {
	/**
	 * @param {string} username - The username that already exists.
	 */
	constructor(username) {
		super(`Username "${username}" already exists`);
		this.username = username;
		this.name = 'UsernameAlreadyExistsError';
	}

	/**
	 * i18n Transalte keys.
	 * 
	 * @returns {Object}
	 */
	translateKeys(){
		return {username: this.username}
	}
}

/**
 * Error thrown when an email is already in use.
 */
export class EmailAlreadyExistsError extends Error {
	/**
	 * @param {string} email - The email that already exists.
	 */
	constructor(email) {
		super(`Email "${email}" already exists`);
		this.email = email;
		this.name = 'EmailAlreadyExistsError';
	}

	/**
	 * i18n Transalte keys.
	 * 
	 * @returns {Object}
	 */
	translateKeys(){
		return {email: this.email}
	}
}
