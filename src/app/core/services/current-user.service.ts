import { Injectable, inject } from '@angular/core';
import { Observable, map, mergeMap, of, throwError } from 'rxjs';
import { API_PATHS } from '../constants/api-paths.constant';
import { RegisterMedicalIn, UserProfileUpdateBody } from '../models/register-request.model';
import { CurrentUserMe, extractCurrentUserMe } from '../models/user-me.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private readonly api = inject(ApiService);

  getMe(): Observable<CurrentUserMe> {
    return this.api.get<unknown>(API_PATHS.usersMe).pipe(
      mergeMap((body) => {
        const me = extractCurrentUserMe(body);
        return me != null ? of(me) : throwError(() => new Error('ME_RESPONSE_SHAPE'));
      })
    );
  }

  updateProfile(body: UserProfileUpdateBody): Observable<void> {
    return this.api.put<unknown>(API_PATHS.usersMeProfile, body).pipe(map(() => undefined));
  }

  updateMedicalConditions(body: RegisterMedicalIn): Observable<void> {
    return this.api.put<unknown>(API_PATHS.usersMeMedicalConditions, body).pipe(map(() => undefined));
  }
}
