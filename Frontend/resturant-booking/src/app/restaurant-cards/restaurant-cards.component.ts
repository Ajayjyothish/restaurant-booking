import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { RestaurantsService } from './../restaurants.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  location: string;
  price: number;
  start_time: any;
  close_time: any;
  rating: number;
  photos: Array<object>;
}

@Component({
  selector: 'app-restaurant-cards',
  templateUrl: './restaurant-cards.component.html',
  styleUrls: ['./restaurant-cards.component.css'],
})
export class RestaurantCardsComponent implements OnInit {
  @Input() restaurant: Restaurant;
  @Input() photos = true;
  @Input() menu = true;
  @Output()
  deleteButtonClicked: EventEmitter<string> = new EventEmitter<string>();
  isLoggedIn = this.authService.isLoggedIn();
  isFavorite = null;

  constructor(
    private restaurantsService: RestaurantsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPhotos();
    if (this.isLoggedIn) {
      this.getIsFavourite();
    }
  }

  getIsFavourite(): void {
    this.restaurantsService.getIsFavorite(this.restaurant.id).subscribe({
      next: (data: Array<object>) => {
        if (data.length > 0) {
          this.isFavorite = true;
        } else {
          this.isFavorite = false;
        }
        console.log('isfav: ', this.isFavorite);
      },
      error: (error) => {
        console.error('getIsFavourite: ', error);
      },
    });
  }

  getPhotos(): void {
    this.restaurantsService.getPhotos(this.restaurant.id).subscribe({
      next: (data: Array<any>) => {
        this.restaurant.photos = data;
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  deleteClick(): void {
    if (this.isLoggedIn === true) {
      const result = confirm('Are you sure you want to delete the item?');
      if (result) {
        this.restaurantsService
          .deleteUserRestaurant(this.restaurant.id)
          .subscribe({
            next: (data: Array<any>) => {
              console.log('Delete response: ', data);
              this.deleteButtonClicked.emit('Delete button clicked');
            },
            error: (error) => {
              console.error('There was an error: ', error);
            },
          });
      } else {
        console.log('Not deleted');
      }
    } else {
      this.router.navigate(['home']);
    }
  }

  timeConvert(time): string {
    return this.restaurantsService.tConvert(time);
  }

  stringTrim(text): string {
    if (text.length > 24) {
      return text.slice(0, 24) + '...';
    }
    return text;
  }
}
