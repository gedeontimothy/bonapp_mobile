import UserPersonSnapshotMapper from "./UserPersonSnapshotMapper";

export default class UserMapper {
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

	static toDTOList(users){
		return Array.from(users).map(UserMapper.toDTO);
	}
}
