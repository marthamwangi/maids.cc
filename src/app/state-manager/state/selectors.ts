import { createSelector } from '@ngrx/store';
import { AppState } from './store';

/**
 * This is the root state for state app module
 */

const singleUser = (state: AppState) => state.users.userDetails;
const usersList = (state: AppState) => state.users.usersListDetails;

/**
 * Select users from users store
 */

export const usersListSelector = createSelector(
  usersList,
  (statePiece) => statePiece.users
);

export const totalPagesSelector = createSelector(
  usersList,
  (statePiece) => statePiece.totalPages
);
export const perPageSelector = createSelector(
  usersList,
  (statePiece) => statePiece.perPage
);
export const totalUsersSelector = createSelector(
  usersList,
  (statePiece) => statePiece.totalUsers
);

export const currentPageSelector = createSelector(
  usersList,
  (statePiece) => statePiece.pageNumber
);

/**
 * Select user from users store
 */

export const singleUserSelector = createSelector(
  singleUser,
  (statePiece) => statePiece.user
);

export const currentUserIDSelector = createSelector(
  singleUser,
  (statePiece) => statePiece.user.id
);
