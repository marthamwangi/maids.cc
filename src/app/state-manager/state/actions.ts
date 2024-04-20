import { createAction, props } from '@ngrx/store';
import * as UserActionNames from './actions-names';
import { IUserModel, IUserResponse } from '../model/user.model';

/**
 * get users from api
 */
export const getPageUsersFromBackend = createAction(
  UserActionNames.FetchAllUsers,
  props<{
    page: number;
  }>()
);

/**
 * Set users in store after fetching them
 */
export const setAllUsersStore = createAction(
  UserActionNames.CreateAllUsers,
  props<{
    data: {
      users: Array<IUserModel>;
      totalUsers: number;
      totalPages: number;
      perPage: number;
      pageNumber: number;
    };
  }>()
);

/**
 * get user from api
 */
export const getSingleUserFromBackend = createAction(
  UserActionNames.FetchOneUser,
  props<{
    id: number;
  }>()
);

/**
 * Set user in store after fetching
 */
export const setSingleUserStore = createAction(
  UserActionNames.CreateOneUser,
  props<{
    user: IUserResponse;
  }>()
);
