import { Action } from '@ngrx/store';
import { Exercise } from './exercise.model';

export const SET_AVAILABLE_TRAINING = '[Training] Set Available Training';
export const SET_FINISHED_TRAINING = '[Training] Set Finished Training';
export const START_ACTIVE_TRAINING = '[Training] Start Active Training';
export const STOP__ACTIVE_TRAINING = '[Training] Stop Active Training';

export class SetAvailableTraining implements Action {
    readonly type = SET_AVAILABLE_TRAINING;

    constructor(public payload: Exercise[]) {} // *note: payload has to be public
}

export class SetFinishedTraining implements Action {
    readonly type = SET_FINISHED_TRAINING;

    constructor(public payload: Exercise[]) {}
}

export class StartActiveTraining implements Action {
    readonly type = START_ACTIVE_TRAINING;

    constructor(public payload: string) {}
}

export class StopActiveTraining implements Action { // no need for payload
    readonly type = STOP__ACTIVE_TRAINING;
}

export type TrainingActions = SetAvailableTraining | SetFinishedTraining | StartActiveTraining | StopActiveTraining;