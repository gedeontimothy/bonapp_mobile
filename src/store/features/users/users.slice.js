import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { builProcessThunks } from '../process/process.slice';

const initialState = {
};

export const usersSlice = createSlice({
	name: 'users',

	initialState,

	reducers: {

	},
	// extraReducers: (builder) => {
	// },

});

export const {
	addProcess: addUserProcess,
	setProcess: setUserProcess,
	setProcessState: setUserProcessState,
	removeProcess: removeUserProcess,
	markPendingProcessState: markPendingUserProcessState,
	markRejectedProcessState: markRejectedUserProcessState,
	markFulfilledProcessState: markFulfilledUserProcessState,
} = builProcessThunks("users");


export const {  } = usersSlice.actions;

export default usersSlice.reducer;
