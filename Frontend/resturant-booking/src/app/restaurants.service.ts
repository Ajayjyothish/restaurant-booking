import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  getTopRestaurants(){
    return this.http.get('/api/restaurants/top-restaurants');
  }

  getAllRestaurants(): any{
    return this.http.get('/api/restaurants');
  }

  postUser(body: object): any{
    return this.http.post<any>('/api/users/signup', body);
  }

}
