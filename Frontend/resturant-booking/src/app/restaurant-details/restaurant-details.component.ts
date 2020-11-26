import { RestaurantsService } from './../restaurants.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

interface Restaurant {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  price: string;
  start_time: string;
  close_time: string;
  rating: string;
  phone: string;
  address1: string;
  address2: string;
}

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.css'],
})
export class RestaurantDetailsComponent implements OnInit {
  restaurantId: any;
  images = ['bbq.png', 'bbq1.jpg', 'bbq2.jpeg'].map(
    (n) => `http://localhost:3000/images/${n}`
  );

  restaurant: Restaurant = {
    id: '',
    name: '',
    location: '',
    cuisine: '',
    price: '',
    start_time: '',
    close_time: '',
    rating: '',
    phone: '',
    address1: '',
    address2: ''
  };

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantsService
  ) {
    this.route.params.subscribe((params) => {
      this.restaurantId = params.restaurantId;
    });
  }

  ngOnInit(): void {
    this.restaurantService.getRestaurant(this.restaurantId).subscribe({
      next: (data: Array<Restaurant>) => {
        this.restaurant = data[0];
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }
}
