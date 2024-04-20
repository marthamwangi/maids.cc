import { Injectable, inject } from '@angular/core';
import { DeserializeSingleUser, DeserializeUsers } from '../mapper/user.mapper';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { CrudService } from '../service/crud.service';
import * as UserActions from './actions';
import { filter, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromUserSelector from './selectors';
import { AppState } from './store';
@Injectable({ providedIn: 'root' })
export class UserEffects {
  private _deserializeUsers: DeserializeUsers = new DeserializeUsers();
  private _deserializeOneUser: DeserializeSingleUser =
    new DeserializeSingleUser();
  private _actions: Actions = inject(Actions);
  private _store: Store<AppState> = inject(Store);
  private _crudService: CrudService = inject(CrudService);

  fetchUsersList$ = createEffect(() =>
    this._actions.pipe(
      ofType(UserActions.getPageUsersFromBackend),
      concatLatestFrom(() =>
        this._store.select(fromUserSelector.currentPageSelector)
      ),
      filter(
        ([action, pageNumber]) =>
          pageNumber !== action.page && pageNumber !== undefined
      ),
      mergeMap(([action, pageNumber]) =>
        this._crudService.getAllUsers({ page: action.page }).pipe(
          map((response) =>
            UserActions.setAllUsersStore({
              data: this._deserializeUsers.deserialize(response),
            })
          )
        )
      )
    )
  );

  fetchSingleUser$ = createEffect(() =>
    this._actions.pipe(
      ofType(UserActions.getSingleUserFromBackend),
      concatLatestFrom(() =>
        this._store.select(fromUserSelector.currentUserIDSelector)
      ),
      filter(([action, id]) => action.id !== id || id === 0),
      mergeMap(([action]) =>
        this._crudService.getOne(action.id).pipe(
          map((response) =>
            UserActions.setSingleUserStore({
              user: this._deserializeOneUser.deserialize(response),
            })
          )
        )
      )
    )
  );
}
