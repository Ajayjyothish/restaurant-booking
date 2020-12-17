import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from '../restaurants.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  shouldLoad = true;
  pageNo = 0;
  restaurants = null;
  constructor(private restaurantsService: RestaurantsService) {}

  ngOnInit(): void {
    this.getFavoriteRestaurants();
  }

  getFavoriteRestaurants(): void {
    this.restaurantsService.getFavorites(this.pageNo).subscribe({
      next: (data: Array<object>) => {
        this.restaurants = data;
        console.log('Favorite Restaurants: ', this.restaurants);
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  onScroll(): void {
    if (this.shouldLoad) {
      this.pageNo++;
      this.restaurantsService.getFavorites(this.pageNo).subscribe({
        next: (data: Array<any>) => {
          this.restaurants.push(...data);
          console.log('Scroll Data: ', data);
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
