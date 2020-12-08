import { AuthService } from './../auth.service';
import { RestaurantsService } from './../restaurants.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from '@kolkov/ngx-gallery';
import * as moment from 'moment';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.css'],
})
export class RestaurantDetailsComponent implements OnInit {
  restaurantId: any;
  images = ['bbq.png', 'bbq1.jpg', 'bbq2.jpeg'].map(
    (n) => `http://localhost:3000/images/${n}`
  );

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];

  restaurant = null;
  reviews = null;
  isLoggedIn = this.authService.isLoggedIn();

  pageNo = 0;
  shouldLoad = true;

  lat = 9.9312;
  lng = 76.2673;
  newReview = {
    rating: 0,
    review: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: RestaurantsService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {
    this.route.params.subscribe((params) => {
      this.restaurantId = params.restaurantId;
    });
  }

  ngOnInit(): void {
    this.getRestaurant();
    this.fetchReviews();
    this.setGalleryOptions();
    this.getPhotos();
  }

  getPhotos(): void{
    this.restaurantService.getPhotos(this.restaurantId).subscribe({
      next: (data: Array<any>) => {
        data.map((item) => {
          this.galleryImages.push({
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

  openPhotosModal(content): void {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
    });
  }

  open(content): void {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
    });
  }

  getRestaurant(): void {
    this.restaurantService.getRestaurant(this.restaurantId).subscribe({
      next: (data: Array<object>) => {
        this.restaurant = data[0];
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  loadMoreReviews(): void {
    this.pageNo++;
    this.restaurantService
      .getReviews(this.restaurantId, this.pageNo)
      .subscribe({
        next: (data) => {
          this.reviews.push(...data);
          console.log('Reviews: ', data);
          if (data.length <= 1) {
            this.shouldLoad = false;
          }
        },
        error: (error) => {
          console.error('There was an error: ', error);
        },
      });
  }

  fetchReviews(): void {
    this.restaurantService
      .getReviews(this.restaurantId, this.pageNo)
      .subscribe({
        next: (data) => {
          this.reviews = data;
          console.log('Reviews: ', data);
        },
        error: (error) => {
          console.error('There was an error: ', error);
        },
      });
  }

  momentify(date): string {
    return moment.utc(date, 'YYYY-MM-DD HH:mm:ss').fromNow();
  }

  timeConvert(time): string {
    return this.restaurantService.tConvert(time);
  }

  isOpen(): boolean {
    const hrs = moment().format('HH:mm');
    if (
      this.restaurant.start_time.slice(0, 5) <= hrs &&
      this.restaurant.close_time.slice(0, 5) > hrs
    ) {
      return true;
    } else {
      return false;
    }
  }

  onSubmit(formValue: object): void {
    const review = {
      rating: this.newReview.rating,
      review: this.newReview.review,
      restaurantId: this.restaurantId,
    };
    this.restaurantService.postReviews(review).subscribe({
      next: (res) => {
        console.log('Review posted');
        this.fetchReviews();
      },
      error: (error) => {
        console.error('There was an error', error);
        this.router.navigate(['home']);
      },
    });
  }
}
