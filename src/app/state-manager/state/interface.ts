import { IUserModel } from '../model/user.model';

export interface IUserState {
  usersListDetails: {
    users: Array<IUserModel>;
    totalUsers: number;
    totalPages: number;
    perPage: number;
    pageNumber: number;
  };

  userDetails: {
    user: IUserModel;
  };
}
