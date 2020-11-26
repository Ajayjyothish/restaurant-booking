import { RestaurantsService } from './../restaurants.service';
import { Component, Input, OnInit } from '@angular/core';

interface Restaurant{
  id: number;
  name: string;
  cuisine: string;
  location: string;
  price: number;
  start_time: any;
  close_time: any;
  rating: number;
}

@Component({
  selector: 'app-restaurant-cards',
  templateUrl: './restaurant-cards.component.html',
  styleUrls: ['./restaurant-cards.component.css']
})
export class RestaurantCardsComponent implements OnInit {

  @Input() restaurant: Restaurant;

  constructor(private restaurantsService: RestaurantsService) { }

  ngOnInit(): void {
  }

  timeConvert(time){
    return this.restaurantsService.tConvert(time);
  }

}
