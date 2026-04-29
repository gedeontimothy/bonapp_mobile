import React, {useEffect, useState} from 'react'

import BootLoadingScreen from '../screens/boot.loading.screen'


const Boot = ({children}) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 3000);
	}, []);

	if(loading) return <BootLoadingScreen/>;

	return children
};

export default ({children}) => {
	return (
		<Boot>
			{children}
		</Boot>
	)
}
