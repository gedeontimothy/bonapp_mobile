import UserPersonSnapshotMapper from "./UserPersonSnapshotMapper";

export default class UserMapper {
	/**
	 * @param {UserModelNonSerializable} user 
	 * @returns {?UserModel}
	 */
	static toDTO(user) {
		if(!user) return null;

		return {
			_id: user._id?.toString() ?? user._id,
			personId: user.personId?.toString() ?? user.personId,

			person: UserPersonSnapshotMapper.toDTO(user.person),

			username: user.username,
			pin: user.pin,
			email: user.email,

			email_verified_at: user.email_verified_at?.toISOString(),
			createdAt: user.createdAt?.toISOString(),
			updatedAt: user.updatedAt?.toISOString(),
			deletedAt: user.deletedAt?.toISOString(),
		}
	}

	/**
	 * @param {Array<UserModelNonSerializable>} users 
	 * @returns {Array<UserModel>}
	 */
	static toDTOList(users){
		return Array.from(users).map(UserMapper.toDTO);
	}
}
