export type viewType = 'skeleton' | 'content' | 'noContent';

export interface IUsersResponse {
  users: Array<IUserModel>;
  totalUsers: number;
  totalPages: number;
  perPage: number;
}

export interface IUserResponse {
  user: IUserModel;
}
export interface IUserModel {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface AllUsersResponse {
  data: Array<UserData>;
  per_page: number;
  total_pages: number;
  total: number;
}

export interface UserResponse {
  data: UserData;
}

export interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}
