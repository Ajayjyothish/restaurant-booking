import { RestaurantsService } from './../restaurants.service';
import { Component, Input, OnInit } from '@angular/core';

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

  constructor(private restaurantsService: RestaurantsService) {}

  ngOnInit(): void {
    this.getPhotos();
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
