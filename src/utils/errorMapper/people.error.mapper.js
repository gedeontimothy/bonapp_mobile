import { PersonNotExistsError } from "../../database/errors/people.exception";

export const peopleErrorMap = new Map([
	[PersonNotExistsError, 'errors:people.notExists'],
]);
