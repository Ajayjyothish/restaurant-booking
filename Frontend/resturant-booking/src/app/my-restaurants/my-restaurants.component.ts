import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from '../restaurants.service';

@Component({
  selector: 'app-my-restaurants',
  templateUrl: './my-restaurants.component.html',
  styleUrls: ['./my-restaurants.component.css'],
})
export class MyRestaurantsComponent implements OnInit {
  userRestaurants = null;
  shouldLoad = true;
  pageNo = 0;

  constructor(private restaurantsService: RestaurantsService) {}

  ngOnInit(): void {
    this.getuserRestaurants();
  }

  getuserRestaurants(): void {
    this.restaurantsService.getUserRestaurants(this.pageNo).subscribe({
      next: (data: Array<object>) => {
        this.userRestaurants = data;
        console.log('User Restaurants: ', this.userRestaurants);
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  resetLoadValues(): void {
    this.pageNo = 0;
    window.scrollTo(0, 0);
    this.shouldLoad = true;
  }

  handleDelete(valueEmmited): void {
    this.resetLoadValues();
    this.getuserRestaurants();
  }

  onScroll(): void {
    if (this.shouldLoad) {
      this.pageNo++;
      this.restaurantsService.getUserRestaurants(this.pageNo).subscribe({
        next: (data: Array<any>) => {
          this.userRestaurants.push(...data);
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
