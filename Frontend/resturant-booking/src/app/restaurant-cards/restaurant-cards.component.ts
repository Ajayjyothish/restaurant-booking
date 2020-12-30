import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { RestaurantsService } from './../restaurants.service';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from '@kolkov/ngx-gallery';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  galleryMenus: NgxGalleryImage[] = [];
  galleryOptions: NgxGalleryOptions[];

  constructor(
    private restaurantsService: RestaurantsService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getPhotos();
    if (this.isLoggedIn) {
      this.getIsFavourite();
    }
    this.setGalleryOptions();
    this.getMenus();
  }

  getMenus(): void {
    this.restaurantsService.getMenus(this.restaurant.id).subscribe({
      next: (data: Array<any>) => {
        data.map((item) => {
          this.galleryMenus.push({
            small: item.url,
            medium: item.url,
            big: item.url,
          });
        });
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  setGalleryOptions(): void {
    this.galleryOptions = [
      {
        previewCloseOnClick: true,
        previewCloseOnEsc: true,
        width: '100%',
        height: '575px',
        thumbnailsColumns: 7,
        imageAnimation: NgxGalleryAnimation.Slide,
        arrowNextIcon: 'fa fa-angle-right',
        arrowPrevIcon: 'fa fa-angle-left',
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '400px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,
        thumbnailsColumns: 6,
      },
      // max-width 400
      {
        breakpoint: 400,
        width: '100%',
        height: '300px',
        thumbnailsMargin: 20,
        thumbnailMargin: 10,
        thumbnailsColumns: 4,
        preview: false,
      },
    ];
  }

  open(content): void {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
    });
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
        this.restaurant.photos = data.slice(0, 4);
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
