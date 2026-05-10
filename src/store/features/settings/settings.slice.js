import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
	animate : true,
};

export const settingsSlice = createSlice({
	name: 'settings',

	initialState,

	reducers: {

		/**
		 * Set animation.
		 *
		 * @param {object} state
		 * @param {object} action
		 * @param {object} action.payload - animate value
		 */
		setAnimate(state, action){
			state.animate = action.payload;
		},
	},

});

export const { setAnimate } = settingsSlice.actions;

export default settingsSlice.reducer;
