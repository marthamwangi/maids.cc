import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AllUsersResponse } from '../model/user.model';
import { map } from 'rxjs';
import { DeserializeUsers } from '../mapper/user.mapper';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  private _httpClient: HttpClient = inject(HttpClient);
  private _url = 'https://reqres.in/api/users';
  private _deserializeUsers: DeserializeUsers = new DeserializeUsers();

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
}
