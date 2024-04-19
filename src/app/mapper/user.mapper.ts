import {
  AllUsersResponse,
  IUserModel,
  IUsersResponse,
  UserData,
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

function deserializeUsers(data: Array<UserData>): Array<IUserModel> {
  return data.map((entity) => ({
    id: entity.id,
    email: entity.email,
    firstName: entity.first_name,
    lastName: entity.last_name,
    avatar: entity.avatar,
  }));
}
