import {
  AllUsersResponse,
  IUserModel,
  IUserResponse,
  IUsersResponse,
  UserData,
  UserResponse,
} from '../model/user.model';

export class DeserializeUsers {
  deserialize(response: AllUsersResponse): IUsersResponse {
    return {
      perPage: response.per_page,
      totalPages: response.total_pages,
      totalUsers: response.total,
      users: deserializeUsers(response.data),
    };
  }
}

export class DeserializeSingleUser {
  deserialize(response: UserResponse): IUserResponse {
    return {
      user: deserializeUser(response.data),
    };
  }
}

function deserializeUser(data: UserData): IUserModel {
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    avatar: data.avatar,
  };
}

function deserializeUsers(data: Array<UserData>): Array<IUserModel> {
  return data.map((entity) => ({
    id: entity.id,
    email: entity.email,
    firstName: entity.first_name,
    lastName: entity.last_name,
    avatar: entity.avatar,
  }));
}
