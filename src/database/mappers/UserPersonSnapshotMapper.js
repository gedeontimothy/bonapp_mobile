export default class UserPersonSnapshotMapper {
	static toDTO(person) {
		if (!person) return null;

		return {
			displayName: person.displayName,
			firstname: person.firstname,
			lastname: person.lastname,
			gender: person.gender,
		}
	}
}
