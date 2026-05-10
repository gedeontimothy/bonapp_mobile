import { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	StatusBar,
	Platform,
	AccessibilityInfo,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withRepeat } from 'react-native-reanimated';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import color from '../theme/color';
import spacing from '../theme/spacing';

import AppText from '../components/AppText';

export default function BootLoadingScreen({navigation}) {

	const [animate, setAnimate] = useState(false);

	const progress = useSharedValue(5);

	const progressStyle = useAnimatedStyle(() => ({
		width: `${progress.value}%`,
		opacity: (progress.value + 35) / 120
	}));

	const startInfiniteAnimation = (toValue = 100, duration = 2000) => {
		progress.value = withRepeat(
			withTiming(toValue, {
				duration,
				easing: Easing.out(Easing.cubic),
			}),
			-1,
			true
		);
	};

	useEffect(() => {
		StatusBar.setBackgroundColor(color.primary);
		changeNavigationBarColor(color.primary, true);

		const checkReduceMotion = async () => setAnimate(!(await AccessibilityInfo.isReduceMotionEnabled()));

		checkReduceMotion();
	}, []);
	
	useEffect(() => {
		if(animate)
			startInfiniteAnimation(60);
	}, [animate, startInfiniteAnimation]);

	return (
		<View style={styles.container}>
			<View></View>
			<View>
				<View style={styles.brand}>
					<View style={styles.logo}>
						<Icon name="diamond" size={28} color={"white"}/>
					</View>
				</View>
				<AppText style={styles.brandText} font="semibold" size="4xl">BonApp</AppText>
				<AppText style={styles.sloganText} font="light" size="xl">THE FINANCIAL ATELIER</AppText>
			</View>
			<View>
				<Animated.View style={[styles.progressBar, progressStyle]} />
				<AppText style={[styles.sloganText, {marginTop: 40, opacity:0.5}]} size="xs" font="semibold">SECURE ACCESS</AppText>
				<View style={{flexDirection:"row", justifyContent:"center",alignContent:"center", marginTop:8, opacity:0.4}}>
					<Icon name="lock" size={10} color="white"/>
					<AppText color="white" style={{marginLeft:8}} size="2xs">ENCRYPTED END-TO-END</AppText>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent:'space-between',
		alignContent: "center",
		backgroundColor: color.primary,
		paddingVertical: 32,
	},
	brand: {
		flexDirection:"row",
		paddingHorizontal: 20,
		justifyContent: 'center',
		alignContent: "center"
	},
	logo: {
		backgroundColor: color['primary-light-500'],
		padding: 24,
		borderRadius: 16,
		borderWidth: 2,
		borderColor: color["primary-light-400"],
	},
	brandText: {
		color: "white",
		textAlign: "center",
		marginTop: 20,
	},
	sloganText: {
		color: "white",
		textAlign: "center",
		opacity: 0.8
	},
	progressBar: {
		height: 2,
		backgroundColor: 'white',
		alignSelf: 'center',
		borderRadius: 1,
	}
});
