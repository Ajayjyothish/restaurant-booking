import { RestaurantsService } from './../restaurants.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  restaurants: object;

  constructor(private restaurantsService: RestaurantsService) { }

  ngOnInit(): void {
    this.restaurantsService.getRestaurants().subscribe(data => {
      this.restaurants = data;
      console.log('We got', this.restaurants);
    });
  }

}
