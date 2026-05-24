import {Object as Model} from "realm";

export class User extends Model {
	static schema = {
		name: "User",
		primaryKey: "_id",
		properties: {
			_id: "uuid",
			personId: "uuid",

			person: 'UserPersonSnapshot',

			username: "string",
			pin: "string",
			email: "string?",

			email_verified_at: "date?",
			createdAt: "date",
			updatedAt: "date",
			deletedAt: "date?",
		},
	}
}
