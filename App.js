import {NavigationContainer} from '@react-navigation/native'
import RootProvider from './src/providers/root.provider'
import AppNavigator from './src/navigations/app.navigator'

const App = () => {
	return (
		<RootProvider>
			<NavigationContainer>
				<AppNavigator />
			</NavigationContainer>
		</RootProvider>
	)
}

export default App
