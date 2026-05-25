export class PersonNotExistsError extends Error {
	constructor(){
		super(`Person not exists`);
		this.name = 'PersonNotExistsError';
	}
}
