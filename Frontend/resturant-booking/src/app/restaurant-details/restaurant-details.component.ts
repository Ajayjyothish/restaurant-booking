import { AuthService } from './../auth.service';
import { RestaurantsService } from './../restaurants.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

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

  restaurant: Restaurant = null;
  reviews = null;
  reviewPage = 2;
  reviewGroups: Array<Restaurant> = null;
  isLoggedIn = this.authService.isLoggedIn();

  newReview = {
    rating: 0,
    review: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: RestaurantsService,
    private authService: AuthService
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

    this.fetchReviews();
  }

  loadMoreReviews() {
    this.reviewGroups.push(
      ...this.reviews.slice(this.reviewPage, this.reviewPage + 2)
    );
    this.reviewPage += 2;
    console.log(this.reviewPage);
  }

  fetchReviews(): void {
    this.restaurantService.getReviews(this.restaurantId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.reviewGroups = data.slice(0, 2);
        console.log('Reviews: ', data);
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  momentify(date): string {
    return moment.utc(date, 'YYYY-MM-DD HH:mm:ss').fromNow();
  }

  timeConvert(time): string {
    return this.restaurantService.tConvert(time);
  }

  onSubmit(formValue: object): void {
    const review = {
      rating: this.newReview.rating,
      review: this.newReview.review,
      restaurantId: this.restaurantId,
    };
    this.restaurantService.postReviews(review).subscribe({
      next: (res) => {
        console.log('Review posted');
        this.fetchReviews();
      },
      error: (error) => {
        console.error('There was an error', error);
        this.router.navigate(['home']);
      },
    });
  }
}
