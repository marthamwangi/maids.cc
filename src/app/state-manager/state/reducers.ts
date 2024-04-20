import { createReducer, on } from '@ngrx/store';
import * as UserActions from './actions';
import { produce } from 'immer';
import { IUserState } from './interface';

/**
 * @initialState
 * Provides initial state values in the current users store .
 */

const initialState: IUserState = {
  userDetails: {
    user: {
      id: 0,
      avatar: '',
      email: '',
      firstName: '',
      lastName: '',
    },
  },
  usersListDetails: {
    users: [],
    totalUsers: 0,
    totalPages: 0,
    perPage: 0,
    pageNumber: 0,
  },
};

export const USER_REDUCER = createReducer(
  initialState,
  /**
   * USER ONS
   */
  on(UserActions.getPageUsersFromBackend, (state, action) =>
    produce(state, (draft) => {})
  ),
  on(UserActions.setAllUsersStore, (state, action) =>
    produce(state, (draft) => {
      draft.usersListDetails.users = action.data.users;
      draft.usersListDetails.totalUsers = action.data.totalUsers;
      draft.usersListDetails.totalPages = action.data.totalPages;
      draft.usersListDetails.perPage = action.data.perPage;
      draft.usersListDetails.pageNumber = action.data.pageNumber;
    })
  ),
  on(UserActions.getSingleUserFromBackend, (state, action) =>
    produce(state, (draft) => {})
  ),
  on(UserActions.setSingleUserStore, (state, action) =>
    produce(state, (draft) => {
      draft.userDetails.user = action.user.user;
    })
  )
);
