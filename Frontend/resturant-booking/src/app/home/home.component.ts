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
    this.getCityRestaurants();
  }

  getTopRestaurants(): void{
    this.restaurantsService.getTopRestaurants().subscribe({
      next: (data: Array<object>) => {
        this.restaurants = data;
        console.log('We got', this.restaurants);
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
        console.log('We got', data);
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
          console.log('We got', data);
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
      this.router
        .navigateByUrl('restaurant-details/' + this.restaurantSearch.id)
        .then(() => {
          window.location.reload();
        });
    }
  }

  open(): void {
    this.modelService.open(SignupComponent);
  }
}
