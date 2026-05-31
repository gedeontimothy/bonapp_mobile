import { createSlice } from '@reduxjs/toolkit';
import { is_number, is_string } from '../../../utils/check';

const initialState = {
	processes : {
		lang : {},
		settings : {},
		auth : {},
		people: {},
		users : {},
	},
	countProcessesOnPending : {
		lang : {
			global : 0,
			action : {},
		},
		settings : {
			global : 0,
			action : {},
		},
		auth : {
			global : 0,
			action : {},
		},
		people : {
			global : 0,
			action : {},
		},
		users : {
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
		 * @param {string} action.payload.progress - Process progression (default value = null)
		 * @param {string} action.payload.error - Error message (default value = null)
		 * @param {string} action.payload.requestId - Request ID (default value = null)
		 */
		addProcess(state, action){
			const {code, actionType, processSliceName, processState = "pending", progress = null, error = null, requestId = null} = action.payload;

			if(is_string(code) && state.processes?.[processSliceName] && !(state.processes[processSliceName]?.[code])){

				state.processes[processSliceName][code] = {
					actionType,
					processState,
					progress: progress,
					error : error,
					requestId,
				};

				if(processState === 'pending')
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
						.filter(([k, v]) => k != 'code' && k != "processState")
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
		markPendingProcessState(state, action){
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
		 * @param {string} action.payload.processSliceName
		 * @param {string} action.payload.code
		 * @param {string} action.payload.error
		 */
		markRejectedProcessState(state, action){
			const { processSliceName, code, error = null } = action.payload;
			if(state.processes?.[processSliceName]?.[code] && state.processes[processSliceName][code].processState !== 'rejected'){
				processSlice.caseReducers.setProcessState(state, {payload: {
					processSliceName,
					code,
					processState: "rejected",
					error : error ?? state.processes[processSliceName][code].error
				}});
			}
		},

		/**
		 * Forces a process state to "fulfilled".
		 *
		 * @param {object} state
		 * @param {object} action
		 * @param {string} action.payload.processSliceName
		 * @param {string} action.payload.code
		 */
		markFulfilledProcessState(state, action){
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
			const processState = process.processState
			if(process) {
				delete state.processes[processSliceName][code];

				if(processState == 'pending') processSlice.caseReducers.decreaseCountProcessPending(
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
	addProcess : buildThunk(processSlice.actions.addProcess, {processSliceName}),
	setProcess : buildThunk(processSlice.actions.setProcess, {processSliceName}),
	setProcessState : buildThunk(processSlice.actions.setProcessState, {processSliceName}),
	removeProcess : buildThunk(processSlice.actions.removeProcess, {processSliceName}),
	markPendingProcessState: buildThunk(processSlice.actions.markPendingProcessState, {processSliceName}),
	markRejectedProcessState: buildThunk(processSlice.actions.markRejectedProcessState, {processSliceName}),
	markFulfilledProcessState: buildThunk(processSlice.actions.markFulfilledProcessState, {processSliceName}),
})

export const {
	addProcess: addPersonProcess,
	setProcess: setPersonProcess,
	setProcessState: setPersonProcessState,
	removeProcess: removePersonProcess,
	markPendingProcessState: markPendingPersonProcessState,
	markRejectedProcessState: markRejectedPersonProcessState,
	markFulfilledProcessState: markFulfilledPersonProcessState,
} = builProcessThunks("people");

export const {
	addProcess,
	setProcess,
	setProcessState,

	markPendingProcessState,
	markRejectedProcessState,
	markFulfilledProcessState,

	increaseCountProcessPending,
	decreaseCountProcessPending,

	removeProcess,
} = processSlice.actions;

export default processSlice.reducer;
