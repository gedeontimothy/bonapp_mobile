import { EmailAlreadyExistsError, UsernameAlreadyExistsError, UserNotExistsError } from "../../database/errors/users.exception";

export const usersErrorMap = new Map([
	[UserNotExistsError, 'errors:users.notExists'],
	[UsernameAlreadyExistsError, 'errors:users.username.alreadyExists'],
	[EmailAlreadyExistsError, 'errors:users.email.alreadyExists']
]);
