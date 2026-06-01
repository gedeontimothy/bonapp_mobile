import WelcomeScreen from "../screens/guest/welcome.screen";
import RegisterScreen from "../screens/auth/register.screen";
import LoginScreen from "../screens/auth/login.screen";

export default {
	auth: {
		RegisterScreen,
		LoginScreen,
	},
	guest: {
		WelcomeScreen,
	},
};
