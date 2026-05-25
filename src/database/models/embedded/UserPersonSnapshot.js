import Realm from "realm";

export class UserPersonSnapshot extends Realm.Object {
	static schema = {
		name: "UserPersonSnapshot",
		
		embedded: true,

		properties: {
			displayName: "string",
			firstname: "string",
			lastname: "string",
			gender: "string",
		}
	}
}
