import { TrainingActions, SET_AVAILABLE_TRAINING, SET_FINISHED_TRAINING, START_ACTIVE_TRAINING, STOP__ACTIVE_TRAINING } from './training.actions';
import { Exercise } from './exercise.model';
import * as fromRoot from '../app.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface TrainingState {
    availableExercises: Exercise[];
    finishedExercises: Exercise[];
    activeTraining: Exercise;
}

export interface State extends fromRoot.State { // done this way for lazy loading of training module
    // contains ui and auth slices of the app state
    training: TrainingState;
}

const initialState: TrainingState = { // an object
    availableExercises: [],
    finishedExercises: [],
     activeTraining: null
};

export function trainingReducer(state = initialState, action: TrainingActions) {
    switch (action.type) {
        case SET_AVAILABLE_TRAINING:
            return {
                ...state, // pulls out the initial state
                availableExercises: action.payload // modification to the initial state (*cannot solely use this line as it will overwrite the entire state to only availableExercises slice)
            };

        case SET_FINISHED_TRAINING:
            return {
                ...state,
                finishedExercises: action.payload
            };

        case START_ACTIVE_TRAINING:
            return {
                ...state,
                activeTraining: { ...state.availableExercises.find(exercise => exercise.id === action.payload) }
            };

        case STOP__ACTIVE_TRAINING:
            return {
                ...state,
                activeTraining: null
            };

        default:
            return state;
    }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getActiveTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining);
export const getOngoingTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining != null);