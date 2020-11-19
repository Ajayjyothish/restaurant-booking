import { Component, Input, OnInit } from '@angular/core';

interface Restaurant{
  id: number;
  name: string;
  cuisine: string;
  location: string;
  price: number;
  time: string;
}

@Component({
  selector: 'app-restaurant-cards',
  templateUrl: './restaurant-cards.component.html',
  styleUrls: ['./restaurant-cards.component.css']
})
export class RestaurantCardsComponent implements OnInit {

  @Input() restaurant: Restaurant;

  constructor() { }

  ngOnInit(): void {
  }

}
