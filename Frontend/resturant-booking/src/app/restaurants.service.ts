import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  getRestaurants(){
    return this.http.get('/api/restaurants');
  }

}
