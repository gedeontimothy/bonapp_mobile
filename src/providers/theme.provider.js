import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { currentTheme } from "../store/features/settings/settings.selector";
import { initSettingTheme } from "../store/features/settings/settings.slice";
import BootLoadingScreen from "../screens/boot.loading.screen";

const Boot = ({children, positionProvider, stopLoading, providersCount}) => {
	const [loading, setLoading] = useState(true);
	
	const dispatch = useDispatch();

	const current_theme = useSelector(currentTheme);

	useEffect(() => {

		const call = async () => {

			await dispatch(initSettingTheme());

			stopLoading();

		}

		call();

	}, []);

	useEffect(() => {
	}, [current_theme]);

	if(providersCount >= positionProvider)
		return children;

	return;
	
};

export default function ThemeProvider({children, positionProvider, stopLoading, providersCount}){
	return (
		<Boot 
			stopLoading={stopLoading}
			positionProvider={positionProvider}
			providersCount={providersCount}
		>
			{children}
		</Boot>
	);
}
