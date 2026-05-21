import {Object as Model} from "realm";

export class Person extends Model {
	static schema = {
		name: 'Person',
		primaryKey: '_id',
		properties: {
			_id: 'uuid',
			firstname: 'string',
			lastname: 'string',
			middlename: 'string?',
			gender: 'string',
			createdAt: 'date',
			updatedAt: 'date',
			deletedAt: 'date?',
		},
	};
}
