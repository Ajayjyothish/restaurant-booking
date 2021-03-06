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

  getAllRestaurants(pageNo): any {
    return this.http.get('/api/restaurants/' + pageNo);
  }
  getFilteredRestaurants(category, pageNo): any {
    return this.http.get(
      '/api/restaurants/category/' + category + '/' + pageNo
    );
  }

  updateRestaurant(body): any {
    return this.http.post('/api/restaurants/edit-restaurant', body);
  }

  uploadFile(formData, restaurantId, newImageName): any {
    return this.http.post(
      '/api/users/uploadfile/restaurants/' + restaurantId + '/' + newImageName,
      formData
    );
  }

  postPhotos(body): any {
    return this.http.post('/api/restaurants/new-restaurant/photos', body);
  }

  postMenus(body): any {
    return this.http.post('/api/restaurants/new-restaurant/menus', body);
  }

  deletePhoto(id): any {
    return this.http.delete('/api/restaurants/photos/' + id);
  }

  deleteMenu(id): any {
    return this.http.delete('/api/restaurants/menus/' + id);
  }

  postRestaurant(body): any {
    return this.http.post('/api/restaurants/new-restaurant', body);
  }

  postUser(body: object): any {
    return this.http.post<any>('/api/users/signup', body);
  }

  socialUser(body): any {
    return this.http.post('/api/users/social-login', body);
  }

  getCities(): any {
    return this.http.get('/api/restaurants/cities');
  }

  getRestaurant(restaurantId): any {
    return this.http.get('/api/restaurants/restaurant/' + restaurantId);
  }

  searchRestaurant(searchString, citySearch): any {
    return this.http.get(
      '/api/restaurants/search/' + citySearch + '/' + searchString
    );
  }

  getIsFavorite(restaurantId): any {
    return this.http.get(
      '/api/restaurants/restaurant/' + restaurantId + '/favorite'
    );
  }

  getFavorites(pageNo): any {
    return this.http.get('/api/restaurants/favorites/' + pageNo);
  }

  postFavorite(body): any {
    return this.http.post('/api/restaurants/restaurant/favorite', body);
  }

  deleteFavorite(restaurantId): any {
    return this.http.delete(
      '/api/restaurants/restaurant/' + restaurantId + '/favorite'
    );
  }

  getUserRestaurants(pageNo): any {
    return this.http.get('/api/restaurants/userRestaurants/' + pageNo);
  }

  deleteUserRestaurant(restaurantId): any {
    return this.http.delete('/api/restaurants/restaurant/' + restaurantId);
  }

  searchKeyword(searchString, citySearch, pageNo): any {
    return this.http.get(
      '/api/restaurants/' + citySearch + '/' + searchString + '/' + pageNo
    );
  }

  getCityRestaurants(cityString, pageNo): any {
    return this.http.get(
      '/api/restaurants/city-restaurants/' + cityString + '/' + pageNo
    );
  }

  getReviews(restaurantId, pageNo): any {
    return this.http.get(
      '/api/restaurants/restaurant/' + restaurantId + '/reviews/' + pageNo
    );
  }

  postReviews(body: object): any {
    return this.http.post<any>('/api/restaurants/review', body);
  }

  postRecentSearches(body: object): any {
    return this.http.post<any>('/api/restaurants/recentSearches', body);
  }

  getRecentSearches(): any {
    return this.http.get('/api/restaurants/recentSearches');
  }

  getPhotos(restaurantId): any {
    return this.http.get('/api/restaurants/photos/' + restaurantId);
  }

  getMenus(restaurantId): any {
    return this.http.get('/api/restaurants/menus/' + restaurantId);
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
    time.splice(1, 3);

    return time.join(''); // return adjusted time or original string
  }
}
