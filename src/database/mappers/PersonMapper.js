export default class PersonMapper {
	/**
	 * @param {PersonModelNonSerializable} person 
	 * @returns {PersonModel}
	 */
	static toDTO(person) {
		if(!person) return null;

		return {
			_id: person._id?.toString() ?? person._id,
			firstname: person.firstname,
			lastname: person.lastname,
			middlename: person.middlename,
			gender: person.gender,

			createdAt: person.createdAt?.toISOString(),
			updatedAt: person.updatedAt?.toISOString(),
			deletedAt: person.deletedAt?.toISOString(),
		};
	}

	/**
	 * @param {Array<PersonModelNonSerializable>} people 
	 * @returns {Array<PersonModel>}
	 */
	static toDTOList(people){
		return Array.from(people).map(PersonMapper.toDTO);
	}
}
