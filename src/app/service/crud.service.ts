import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AllUsersResponse, UserData, UserResponse } from '../model/user.model';
import { map } from 'rxjs';
import { DeserializeSingleUser, DeserializeUsers } from '../mapper/user.mapper';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  title = '';
  private _httpClient: HttpClient = inject(HttpClient);
  private _url = 'https://reqres.in/api/users';
  private _deserializeUsers: DeserializeUsers = new DeserializeUsers();
  private _deserializeOneUser: DeserializeSingleUser =
    new DeserializeSingleUser();

  getAllUsers(params: object) {
    return this._httpClient
      .get<AllUsersResponse>(this._url, {
        params: {
          ...params,
        },
      })
      .pipe(
        map((response) => ({
          response: this._deserializeUsers.deserialize(response),
        }))
      );
  }

  getOne(id: any) {
    return this._httpClient.get<UserResponse>(this._url + '/' + id).pipe(
      map((response) => ({
        data: this._deserializeOneUser.deserialize(response),
      }))
    );
  }
}
