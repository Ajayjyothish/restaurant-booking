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
  restaurants = null;
  allRestaurants: Array<object>;

  pageNo = 0;
  shouldLoad = true;
  filterCategory = 'all';

  constructor(private restaurantsService: RestaurantsService) {}

  ngOnInit(): void {
    this.restaurantsService.getAllRestaurants(this.pageNo).subscribe({
      next: (data: Array<any>) => {
        this.restaurants = data;
        console.log('We got', this.restaurants);
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  resetLoadValues(): void {
    this.pageNo = 0;
    this.shouldLoad = true;
  }

  filterByAll(): void {
    this.filterCategory = 'all';
    this.resetLoadValues();
    this.ngOnInit();
  }

  filterByLunch(): void {
    this.resetLoadValues();
    this.filterCategory = 'lunch';
    this.restaurantsService
      .getFilteredRestaurants(this.filterCategory, this.pageNo)
      .subscribe({
        next: (data: Array<any>) => {
          this.restaurants = data;
          console.log('We got', this.restaurants);
        },
        error: (error) => {
          console.error('There was an error: ', error);
        },
      });
  }

  filterByDinner(): void {
    this.resetLoadValues();
    this.filterCategory = 'dinner';

    this.restaurantsService
      .getFilteredRestaurants(this.filterCategory, this.pageNo)
      .subscribe({
        next: (data: Array<any>) => {
          this.restaurants = data;
          console.log('We got', this.restaurants);
        },
        error: (error) => {
          console.error('There was an error: ', error);
        },
      });
  }

  filterByBreakfast(): void {
    this.resetLoadValues();
    this.filterCategory = 'breakfast';

    this.restaurantsService
      .getFilteredRestaurants(this.filterCategory, this.pageNo)
      .subscribe({
        next: (data: Array<any>) => {
          this.restaurants = data;
          console.log('We got', this.restaurants);
        },
        error: (error) => {
          console.error('There was an error: ', error);
        },
      });
  }

  chooseFunction(pageNo): any {
    if (this.filterCategory !== 'all') {
      return this.restaurantsService.getFilteredRestaurants(
        this.filterCategory,
        pageNo
      );
    } else {
      return this.restaurantsService.getAllRestaurants(pageNo);
    }
  }

  onScroll(): void {
    if (this.shouldLoad) {
      this.pageNo++;
      this.chooseFunction(this.pageNo).subscribe({
        next: (data: Array<any>) => {
          this.restaurants.push(...data);
          console.log('We got', data);
          if (data.length < 4) {
            this.shouldLoad = false;
          }
        },
        error: (error) => {
          console.error('There was an error: ', error);
        },
      });
    }
    console.log('Scrolled');
  }
}
