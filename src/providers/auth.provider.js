import { useEffect, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { initAuth } from "../store/features/auth/auth.slice";
import { useUser } from "../hooks/user.hook";
import UserMapper from "../database/mappers/UserMapper";

const Boot = ({children}) => {
	
	const [loading, setLoading] = useState(true)
	
	const dispatch = useDispatch();

	const store = useStore();

	const { getAllUser } = useUser();

	useEffect(() => {
		
		const call = async () => {
			const users = getAllUser();

			await dispatch(initAuth({users: UserMapper.toDTOList(users)}));

			setLoading(false);

		}

		call();

	}, []);

	if(!loading)
		return children;

	return null;
	
};

export default function AuthProvider({children}){
	return (
		<Boot>
			{children}
		</Boot>
	);
}
