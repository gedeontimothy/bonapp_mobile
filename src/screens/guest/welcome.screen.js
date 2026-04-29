import {
	View,
	StyleSheet,
	SafeAreaView,
} from 'react-native';

import AppText from '../../components/AppText';

export default function WelcomeScreen({navigation}) {
	return (
		<SafeAreaView>
			<View style={styles.container}>
				<AppText size="3xl" scaled={true} color="black">Welcome Interface</AppText>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
	}
});
