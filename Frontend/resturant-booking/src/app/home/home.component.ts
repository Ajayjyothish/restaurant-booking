import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './../auth.service';
import { RestaurantsService } from './../restaurants.service';
import { Component, OnInit } from '@angular/core';
import { SignupComponent } from '../signup/signup.component';

interface Restaurant {
  rating: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  restaurants: Array<object>;
  isLoggedIn = this.authService.isLoggedIn();

  constructor(private restaurantsService: RestaurantsService,private modelService: NgbModal, private authService : AuthService) {}

  ngOnInit(): void {
    this.restaurantsService.getRestaurants().subscribe({
      next: (data: Array<object>) => {
        this.restaurants = data.sort((a: Restaurant, b: Restaurant) => {
          return b.rating - a.rating;
        });
        this.restaurants = this.restaurants.slice(0, 4);
        console.log('We got', this.restaurants);
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  open(){
    this.modelService.open(SignupComponent)
  }

}
