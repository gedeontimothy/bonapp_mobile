import React, {useEffect, useRef, useState} from 'react'
import {RealmProvider, useRealm} from '@realm/react';

import { Person } from '../database/models/Person';

const Boot = ({children}) => {
	const realm = useRealm();

	useEffect(() => {
		if(!realm.isClosed){
			// console.log('---');
		}
	}, [])

	return children;
};

export default ({children}) => {
	return (
		<RealmProvider
			deleteRealmIfMigrationNeeded
			closeOnUnmount={false}
			schema={[Person]}
		>
			<Boot>
				{children}
			</Boot>
		</RealmProvider>
	)
}
