import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestaurantsService } from '../restaurants.service';

interface Restaurant {
  rating: number;
  start_time: string;
  close_time: string;
}

@Component({
  selector: 'app-restaurant-listing-page',
  templateUrl: './restaurant-listing-page.component.html',
  styleUrls: ['./restaurant-listing-page.component.css'],
})
export class RestaurantListingPageComponent implements OnInit {
  restaurants = null;
  allRestaurants: Array<object>;
  city = null;

  pageNo = 0;
  shouldLoad = true;
  filterCategory = 'all';


  constructor(
    private restaurantsService: RestaurantsService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    route.params.subscribe((params) => {
      this.filterCategory = params.filterCategory;
      this.city = params.city;
    });
  }

  ngOnInit(): void {
    this.getRequiredRestaurants();
  }

  resetLoadValues(): void {
    this.pageNo = 0;
    this.city = 'all';
    this.shouldLoad = true;
  }

  open(content): void {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
    });
  }

  filterByAll(): void {
    this.filterCategory = 'all';
    this.resetLoadValues();
    this.getRequiredRestaurants();
  }

  filterByLunch(): void {
    this.resetLoadValues();
    this.filterCategory = 'lunch';
    this.getRequiredRestaurants();
  }

  filterByDinner(): void {
    this.resetLoadValues();
    this.filterCategory = 'dinner';

    this.getRequiredRestaurants();
  }

  filterByBreakfast(): void {
    this.resetLoadValues();
    this.filterCategory = 'breakfast';

    this.getRequiredRestaurants();
  }

  getRequiredRestaurants(): any {
    this.chooseFunction(this.pageNo).subscribe({
      next: (data: Array<any>) => {
        this.restaurants = data;
        console.log('Requied Restaurant: ', this.restaurants);
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  chooseFunction(pageNo): any {
    if (this.city === 'all') {
      if (this.filterCategory !== 'all') {
        return this.restaurantsService.getFilteredRestaurants(
          this.filterCategory,
          pageNo
        );
      } else {
        return this.restaurantsService.getAllRestaurants(pageNo);
      }
    } else {
      if (this.filterCategory === 'all') {
        console.log(this.city);

        return this.restaurantsService.getCityRestaurants(this.city, pageNo);
      } else {
        return this.restaurantsService.searchKeyword(
          this.filterCategory,
          this.city,
          pageNo
        );
      }
    }
  }

  onScroll(): void {
    if (this.shouldLoad) {
      this.pageNo++;
      this.chooseFunction(this.pageNo).subscribe({
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
