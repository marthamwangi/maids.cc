import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AllUsersResponse, UserResponse } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  title = '';
  private _httpClient: HttpClient = inject(HttpClient);
  private _url = 'https://reqres.in/api/users';

  getAllUsers(params: object): Observable<AllUsersResponse> {
    return this._httpClient.get<AllUsersResponse>(this._url, {
      params: {
        ...params,
      },
    });
  }

  getOne(id: number): Observable<UserResponse> {
    return this._httpClient.get<UserResponse>(this._url + '/' + id);
  }
}
