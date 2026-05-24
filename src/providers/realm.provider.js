import React, {useEffect, useRef, useState} from 'react'
import {RealmProvider, useRealm} from '@realm/react';

import { Person } from '../database/models/Person';
import { User } from '../database/models/User';
import { UserPersonSnapshot } from '../database/models/embedded/UserPersonSnapshot';

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
			schema={[
				Person,
				UserPersonSnapshot,
				User
			]}
		>
			<Boot>
				{children}
			</Boot>
		</RealmProvider>
	)
}
