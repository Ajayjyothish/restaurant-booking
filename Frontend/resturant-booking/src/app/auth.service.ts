import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(body: object): any {
    return this.http.post('/api/users/signin', body);
  }

  setSession(authResult): void {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout(): void {
    localStorage.clear();
  }

  public isLoggedIn(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  getExpiration(): any {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  forgotPassword(body: object): any {
    return this.http.post('/api/users/forgotpassword', body);
  }

  newPassword(body: object): any {
    return this.http.post('/api/users/newpassword', body);
  }

  getProfile(): any {
    return this.http.get('api/users/profile');
  }

  updateProfile(body: object): Observable<any> {
    return this.http.post('/api/users/updateprofile', body);
  }

  updateProfleImage(formData: any, newImageUrl: string): any {
    return this.http.post(
      'api/users/uploadfile/profile/0/' + newImageUrl,
      formData
    );
  }
}
