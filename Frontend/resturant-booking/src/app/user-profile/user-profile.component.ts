import { RestaurantsService } from './../restaurants.service';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  profileDetails = null;
  recentRestaurants = null;
  favoriteRestaurants = null;

  userId = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private restaurantsService: RestaurantsService
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {
    this.authService.getProfile().subscribe({
      next: (data: Array<any>) => {
        this.profileDetails = data[0];
        this.getRecentSearches();
        this.getFavoriteRestaurants();
      },
      eror: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  getRecentSearches(): void {
    this.restaurantsService.getRecentSearches().subscribe({
      next: (data: Array<object>) => {
        this.recentRestaurants = data;
        console.log('Recent Searches: ', this.recentRestaurants);
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  getFavoriteRestaurants(): void {
    this.restaurantsService.getFavorites(0).subscribe({
      next: (data: Array<object>) => {
        this.favoriteRestaurants = data;
        console.log('Favorite Restaurants: ', this.favoriteRestaurants);
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  onClick(): void {
    this.router.navigate(['edit-profile']);
  }
}
