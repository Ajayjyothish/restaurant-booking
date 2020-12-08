import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './../auth.service';
import { RestaurantsService } from './../restaurants.service';
import { Component, OnInit } from '@angular/core';
import { SignupComponent } from '../signup/signup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  restaurants: Array<object>;
  isLoggedIn = this.authService.isLoggedIn();
  keyword = 'name';
  searchedRestaurants = null;

  restaurantSearch = null;
  citySearch = null;

  cities = null;

  constructor(
    private restaurantsService: RestaurantsService,
    private modelService: NgbModal,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTopRestaurants();
    this.getCities();
  }

  getTopRestaurants(): void {
    this.restaurantsService.getTopRestaurants().subscribe({
      next: (data: Array<object>) => {
        this.restaurants = data;
        console.log('Top res', this.restaurants);
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  getCities(): void {
    this.restaurantsService.getCities().subscribe({
      next: (data: Array<any>) => {
        this.cities = data;
        this.citySearch = data[0].city;
        console.log('Cities', this.cities);
        this.getCityRestaurants();
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  getCityRestaurants(): void {
    this.restaurantsService.getCityRestaurants(this.citySearch).subscribe({
      next: (data: Array<any>) => {
        this.searchedRestaurants = data;
        console.log('City res', data);
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
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
          this.searchedRestaurants = data;
          console.log('Search Result', data);
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
    if (this.restaurantSearch === null || this.restaurantSearch.id === undefined) {
      this.router.navigate(['restaurant-list/all']);
    } else {
      console.log('routing');
      if (this.isLoggedIn) {
        const recentSearch = {
          restaurantId: this.restaurantSearch.id,
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

  open(): void {
    this.modelService.open(SignupComponent);
  }
}
