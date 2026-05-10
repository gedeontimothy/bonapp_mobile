import { createNativeStackNavigator } from '@react-navigation/native-stack';

import screens from './screens';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
	return (
		<Stack.Navigator
			initialRouteName="guest.welcome"
			screenOptions={{ headerShown: true }}
		>

			{/* ----- Guest ----- */}
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
