import { createSlice } from '@reduxjs/toolkit';
import { is_number, is_string } from '../../../utils/check';

const initialState = {
	processes : {
		lang : {},
		setting : {},
	},
	countProcessesOnPending : {
		lang : {
			global : 0,
			action : {},
		},
		setting : {
			global : 0,
			action : {},
		},
	},
};

export const processSlice = createSlice({
	name: 'process',

	initialState,

	reducers: {

		/**
		 * Adds a process to the slice.
		 *
		 * @param {object} state - Slice state
		 * @param {object} action - Redux action
		 * @param {string} action.payload.code - Unique process identifier
		 * @param {string} action.payload.actionType - Type of action
		 * @param {string} action.payload.processSliceName - Category of the process (e.g., "lang")
		 * @param {string} action.payload.processState - Initial process state (default value = "pending")
		 * @param {string} action.payload.progress
		 * @param {string} action.payload.error
		 */
		addProcess(state, action){
			const {code, actionType, processSliceName, processState, progress, error} = action.payload;
			const state_ = processState ?? "pending";

			if(state.processes?.[processSliceName]){

				state.processes[processSliceName][code] = {
					actionType,
					processState : state_,
					progress: progress ?? null,
					error : error ?? null,
				};

				if(state_ === 'pending')
					processSlice.caseReducers.increaseCountProcessPending(
						state,
						{payload: {
							processSliceName,
							actionType,
						}}
					);
			}
		},

		/**
		 * Updates an existing process and adjusts the pending counter.
		 *
		 * @param {object} state
		 * @param {object} action
		 */
		setProcess(state, action){
			const {processSliceName, code} = action.payload;

			if(state.processes[processSliceName]?.[code]){

				const prevState = state.processes[processSliceName][code]?.processState;

				state.processes[processSliceName][code] = Object.assign(
					state.processes[processSliceName][code],
					Object.fromEntries(Object
						.entries(action.payload)
						.filter(([k, v]) => k != 'code')
					)
				);

				if(is_string(action.payload?.processState) && action.payload.processState !== prevState) processSlice.caseReducers.setProcessState(
					state,
					{payload: {
						processSliceName,
						code,
						processState : action.payload.processState,
					}}
				);
			}
		},

		/**
		 * Updates the state of an existing process and adjusts the pending counter.
		 *
		 * @param {object} state
		 * @param {object} action
		 * @param {string} action.payload.processSliceName - Process category
		 * @param {string} action.payload.code - Process identifier
		 * @param {string} action.payload.processState - New state ("pending", "fulfilled", "rejected")
		 */
		setProcessState(state, action){
			const {processSliceName, code, processState} = action.payload;

			if(state.processes[processSliceName]?.[code]){

				const prevState = state.processes[processSliceName][code].processState;
	
				if(prevState === processState) return;
	
				state.processes[processSliceName][code].processState = processState;
	
				if(prevState === 'pending' && processState !== 'pending')
					processSlice.caseReducers.decreaseCountProcessPending(
						state,
						{payload: {
							processSliceName,
							actionType : state.processes[processSliceName][code].actionType,
						}}
					);
	
				else if(prevState !== 'pending' && processState === 'pending')
					processSlice.caseReducers.increaseCountProcessPending(
						state,
						{payload: {
							processSliceName,
							actionType : state.processes[processSliceName][code].actionType,
						}}
					);

			}

		},

		/**
		 * Forces a process state to "pending".
		 *
		 * @param {object} state
		 * @param {object} action
		 * @param {string} action.payload.processSliceName
		 * @param {string} action.payload.code
		 */
		isPendingProcessState(state, action){
			const { processSliceName, code } = action.payload;
			if(state.processes?.[processSliceName]?.[code] && state.processes[processSliceName][code].processState !== 'pending'){
				processSlice.caseReducers.setProcessState(state, {payload: {
					processSliceName,
					code,
					processState: "pending"
				}});
			}
		},

		/**
		 * Forces a process state to "rejected".
		 *
		 * @param {object} state
		 * @param {object} action
		 */
		isRejectedProcessState(state, action){
			const { processSliceName, code } = action.payload;
			if(state.processes?.[processSliceName]?.[code] && state.processes[processSliceName][code].processState !== 'rejected'){
				processSlice.caseReducers.setProcessState(state, {payload: {
					processSliceName,
					code,
					processState: "rejected"
				}});
			}
		},

		/**
		 * Forces a process state to "fulfilled".
		 *
		 * @param {object} state
		 * @param {object} action
		 */
		isFulfilledProcessState(state, action){
			const { processSliceName, code } = action.payload;
			if(state.processes?.[processSliceName]?.[code] && state.processes[processSliceName][code].processState !== 'fulfilled'){
				processSlice.caseReducers.setProcessState(state, {payload: {
					processSliceName,
					code,
					processState: "fulfilled"
				}});
			}
		},

		/**
		 * Increments the pending process counter for a category.
		 *
		 * @param {object} state
		 * @param {object} action
		 * @param {string} action.payload.processSliceName
		 */
		increaseCountProcessPending(state, action){
			const { processSliceName, actionType } = action.payload;
			state.countProcessesOnPending[processSliceName].global++;

			if(is_string(actionType)){
				const prev = state.countProcessesOnPending[processSliceName].action?.[actionType] ?? 0;
				state.countProcessesOnPending[processSliceName].action[actionType] = prev + 1;
			}

		},

		/**
		 * Decrements the pending process counter for a category.
		 *
		 * @param {object} state
		 * @param {object} action
		 * @param {string} action.payload.processSliceName
		 */
		decreaseCountProcessPending(state, action){
			const { processSliceName, actionType } = action.payload;
			state.countProcessesOnPending[processSliceName].global = Math.max(0, state.countProcessesOnPending[processSliceName].global - 1);

			const prev = state.countProcessesOnPending[processSliceName].action?.[actionType];

			if(is_number(prev)){
				state.countProcessesOnPending[processSliceName].action[actionType] = Math.max(0, prev - 1);
			}
		},

		/**
		 * Removes a process and adjusts the pending counter if necessary.
		 *
		 * @param {object} state
		 * @param {object} action
		 * @param {string} action.payload.processSliceName
		 * @param {string} action.payload.code
		 */
		removeProcess(state, action){
			const { processSliceName, code } = action.payload;
			const process = state.processes[processSliceName]?.[code];
			if(process) {
				delete state.processes[processSliceName][code];

				processSlice.caseReducers.decreaseCountProcessPending(
					state,
					{payload: {
						processSliceName,
						actionType : process.actionType,
					}}
				);
			}
		},

	},
	extraReducers: (builder) => {},

});

/**
 * Creates a simple thunk that adds extra data to the payload before dispatching.
 *
 * @param {Function} actionCreator - Action to call
 * @param {object} defaults - Default payload to merge
 * @returns {Function}
 */
const buildThunk = (actionCreator, defaults = {}) =>
	payload =>
		dispatch => 
			dispatch(actionCreator(Object.assign(payload, defaults)));

/**
 * Builds thunks for a specific process category.
 *
 * @param {string} processSliceName
 * @returns {object} thunks - Contains addProcess, setProcessState, removeProcess with prefilled processSliceName
 */
export const builProcessThunks = processSliceName => ({
	addProcess : buildThunk(addProcess, {processSliceName}),
	setProcess : buildThunk(setProcess, {processSliceName}),
	setProcessState : buildThunk(setProcessState, {processSliceName}),
	removeProcess : buildThunk(removeProcess, {processSliceName}),
	isFulfilledProcessState: buildThunk(isFulfilledProcessState, {processSliceName}),
})

export const {
	addProcess,
	setProcess,
	setProcessState,

	isPendingProcessState,
	isRejectedProcessState,
	isFulfilledProcessState,

	increaseCountProcessPending,
	decreaseCountProcessPending,

	removeProcess,
} = processSlice.actions;

export default processSlice.reducer;
