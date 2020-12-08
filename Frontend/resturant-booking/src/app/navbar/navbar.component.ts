import { Router } from '@angular/router';
import { RestaurantsService } from './../restaurants.service';
import { AuthService } from './../auth.service';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isNavbarCollapsed = true;
  isLoggedIn = this.authService.isLoggedIn();
  loggedInUserId = null;

  keyword = 'name';
  restaurants = null;

  restaurantSearch = null;
  citySearch = null;

  cities = null;

  constructor(
    private authService: AuthService,
    private restaurantsService: RestaurantsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCities();
    this.getCityRestaurants();
    this.getLoggedinUserId();
  }

  getLoggedinUserId(): void {
    if (this.isLoggedIn) {
      this.authService.getProfile().subscribe({
        next: (data: Array<any>) => {
          this.loggedInUserId = data[0].id;
        },
        eror: (error) => {
          console.error('There was an error: ', error);
        },
      });
    }
  }

  getCities(): void {
    this.restaurantsService.getCities().subscribe({
      next: (data: Array<any>) => {
        this.cities = data;
        this.citySearch = data[0].city;
        console.log('Cities', this.cities);
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  getCityRestaurants(): void {
    this.restaurantsService.getCityRestaurants(this.citySearch).subscribe({
      next: (data: Array<any>) => {
        this.restaurants = data;
        console.log('We got', this.restaurants);
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  @HostListener('window:resize', ['$event']) onResize(event): void {
    this.isNavbarCollapsed = true;
  }

  onCityChange(): void {
    this.getCityRestaurants();
  }

  onChangeSearch(val: string): void {
    if (val === '') {
      this.getCityRestaurants();
    } else {
      this.restaurantsService.searchRestaurant(val, this.citySearch).subscribe({
        next: (data: Array<any>) => {
          this.restaurants = data;
          console.log('We got', this.restaurants);
        },
        error: (error) => {
          console.error('There was an error: ', error);
        },
      });
    }
  }
  onFocused(e): void {
    // do something when input is focused
  }

  selectEvent(item): void {}

  onSubmit(value): any {
    console.log(value);
    if (
      this.restaurantSearch === null ||
      this.restaurantSearch.id === undefined
    ) {
      return;
    } else {
      console.log('routing');
      if (this.isLoggedIn) {
        const recentSearch = {
          restaurantId: this.restaurantSearch.id,
          userId: this.loggedInUserId,
        };
        this.restaurantsService.postRecentSearches(recentSearch).subscribe({
          next: (data: Array<any>) => {
            console.log(data);
          },
          error: (error) => {
            console.error('There was an error: ', error);
          },
        });
      }
      this.router.navigateByUrl(
        'restaurant-details/' + this.restaurantSearch.id
      );
    }
  }
}
