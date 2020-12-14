import { Router } from '@angular/router';
import { RestaurantsService } from './../restaurants.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.css'],
})
export class AddRestaurantComponent implements OnInit {
  restaurantDetails = {
    name: '',
    location: '',
    startTime: '',
    closeTime: '',
    cuisine: '',
    price: '',
    phone: '',
    address1: '',
    address2: '',
    rating: 0,
    city: '',
    state: '',
    pin: '',
  };
  constructor(
    private restaurantService: RestaurantsService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.restaurantService.postRestaurant(this.restaurantDetails).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['my-restaurants']);
      },
      error: (error) => {
        console.error('Submit error: ', error);
      },
    });
  }
}
