import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  constructor(private http: HttpClient) {}

  // tslint:disable-next-line: typedef
  getTopRestaurants() {
    return this.http.get('/api/restaurants/top-restaurants');
  }

  getAllRestaurants(): any {
    return this.http.get('/api/restaurants');
  }

  postUser(body: object): any {
    return this.http.post<any>('/api/users/signup', body);
  }

  tConvert(time): string {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }
}
