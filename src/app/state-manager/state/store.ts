import { Action, ActionReducer } from '@ngrx/store';
import { IUserState } from './interface';
import { USER_REDUCER } from './reducers';

export interface AppState {
  users: IUserState;
}

export interface AppStore {
  users: ActionReducer<IUserState, Action>;
}

export const APP_STORE: AppStore = {
  users: USER_REDUCER,
};
