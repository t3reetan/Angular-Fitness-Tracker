// This app reducer does not define its own reducers but merges various reducers the 
// application will eventually have
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';

export interface State {
    ui: fromUi.State; // UI related slice of the state
    auth: fromAuth.State; // Auth related slice of the state
}

export const reducers: ActionReducerMap<State> = {
    ui: fromUi.uiReducer,
    auth: fromAuth.authReducer
};

// UI slice selectors
export const getUiState = createFeatureSelector<fromUi.State>('ui'); // needs to know what kind of state to work with | 'ui' targets the ui slice of the store
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

// Auth slice selectors
export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuthenticated);