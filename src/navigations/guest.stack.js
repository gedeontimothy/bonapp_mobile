import { createNativeStackNavigator } from '@react-navigation/native-stack';

import screens from './screens';

const Stack = createNativeStackNavigator();

export default function GuestStack() {
	return (
		<Stack.Navigator
			initialRouteName="guest.welcome"
			screenOptions={{ headerShown: true }}
		>

			{/* ----- Auth ----- */}
			<Stack.Screen
				name="auth.register"
				component={screens.auth.RegisterScreen}
				options={{ headerShown: false }}
			/>

			<Stack.Group>
				<Stack.Screen
					name="guest.welcome"
					component={screens.guest.WelcomeScreen}
					options={{ headerShown: false }}
				/>
			</Stack.Group>

		</Stack.Navigator>
	);
}
