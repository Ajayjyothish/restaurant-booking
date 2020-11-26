import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from '../restaurants.service';

interface Restaurant {
  rating: number;
  start_time: string;
  close_time: string;
}

@Component({
  selector: 'app-restaurant-listing-page',
  templateUrl: './restaurant-listing-page.component.html',
  styleUrls: ['./restaurant-listing-page.component.css'],
})
export class RestaurantListingPageComponent implements OnInit {
  restaurants: Array<object>;
  allRestaurants: Array<object>;

  constructor(private restaurantsService: RestaurantsService) {}

  ngOnInit(): void {
    this.restaurantsService.getAllRestaurants().subscribe({
      next: (data: Array<object>) => {
        this.restaurants = data;
        this.allRestaurants = data;
        console.log('We got', this.restaurants);
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  filterByAll(): void{
    this.restaurants = this.allRestaurants;
  }

  filterByLunch(): void {
    this.restaurants = this.allRestaurants.filter((restaurant: Restaurant) => {
      if (restaurant.close_time.slice(0, 2) >= '15' && restaurant.start_time.slice(0,2) <= "12") {
        return restaurant;
      }
    });
  }

  filterByDinner(): void {
    this.restaurants = this.allRestaurants.filter((restaurant: Restaurant) => {
      if (restaurant.close_time.slice(0, 2) > '18') {
        return restaurant;
      }
    });
  }

  filterByBreakfast(): void {
    this.restaurants = this.allRestaurants.filter((restaurant: Restaurant) => {
      if (restaurant.start_time.slice(0, 2) < '12') {
        return restaurant;
      }
    });
  }
}
