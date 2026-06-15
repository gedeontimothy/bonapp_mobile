export default class UserPersonSnapshotMapper {
	/**
	 * @param {UserPersonSnapshot} person 
	 * @returns {?UserPersonSnapshot}
	 */
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
