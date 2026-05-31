import { useEffect } from "react";
import { useAuth } from "../hooks/auth.hook";
import GuestStack from "./guest.stack";
import { Text, View } from "react-native";
import { Button } from "../components/Button";
import AppText from "../components/AppText";


export default function AppNavigator() {
	const { isAuth, logout, authOnProcessing } = useAuth();

	return isAuth ? (
		<View>
			<AppText>Is Authentified</AppText>
			<Button disabled={authOnProcessing} onPress={logout}>Logout</Button>
		</View>
	) : <GuestStack/>;
}
