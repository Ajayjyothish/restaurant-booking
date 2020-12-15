import { AuthService } from './../auth.service';
import { RestaurantsService } from './../restaurants.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-restaurant',
  templateUrl: './edit-restaurant.component.html',
  styleUrls: ['./edit-restaurant.component.css'],
})
export class EditRestaurantComponent implements OnInit {
  restaurantDetails = null;
  restaurantId = null;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private restaurantService: RestaurantsService
  ) {
    this.route.params.subscribe((params) => {
      this.restaurantId = params.restaurantId;
    });
  }

  ngOnInit(): void {
    this.getRestaurantDetails();
  }

  open(content): void {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
    });
  }

  markerDragEnd($event: google.maps.MouseEvent): void {
    this.restaurantDetails.latitude = $event.latLng.lat();
    this.restaurantDetails.longitude = $event.latLng.lng();
  }

  getRestaurantDetails(): void {
    this.restaurantService.getRestaurant(this.restaurantId).subscribe({
      next: (data: Array<object>) => {
        this.restaurantDetails = data[0];
        console.log(data[0]);
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  onSubmit(): void {
    if (this.authService.isLoggedIn()) {
      this.restaurantService.updateRestaurant(this.restaurantDetails).subscribe({
        next: (data) => {
          console.log('Restaurant Updated');
          this.router.navigate(['my-restaurants']);
        },
        error: (error) => {
          console.error('Submit error: ', error);
        },
      });
    } else {
      this.router.navigate(['home']);
    }
  }
}
