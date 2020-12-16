import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestaurantsService } from './../restaurants.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.css'],
})
export class AddRestaurantComponent implements OnInit {
  restaurantDetails = {
    name: '',
    location: '',
    startTime: '',
    closeTime: '',
    cuisine: '',
    price: '',
    phone: '',
    address1: '',
    address2: '',
    rating: 0,
    city: '',
    state: '',
    pin: '',
    lat: 9.9312,
    lng: 76.2673,
  };

  myfiles = [];

  constructor(
    private restaurantService: RestaurantsService,
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  open(content): void {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
    });
  }

  onFileSelect(event): void {
    for (const file of event.target.files) {
      this.myfiles.push(file);
    }
  }

  markerDragEnd($event: google.maps.MouseEvent): void {
    this.restaurantDetails.lat = $event.latLng.lat();
    this.restaurantDetails.lng = $event.latLng.lng();
  }

  uploadPhotos(data): void{
    if (this.myfiles.length !== 0) {
      for (const file of this.myfiles) {
        const formData = new FormData();
        formData.append('uploadedImage', file);
        const restaurantId = data[0].id;
        this.restaurantService
          .uploadFile(formData, restaurantId, file.name)
          .subscribe({
            next: () => {
              console.log('Restaurant photos added');
              const photo = {
                url: `http://localhost:3000/my_uploaded_files/restaurants/${restaurantId}/${file.name}`,
                restaurantId,
              };
              this.restaurantService.postPhotos(photo).subscribe({
                next: (dbResponse) => {
                  console.log(dbResponse);
                },
                error: (error) => {
                  console.error('There was an error posting to db: ', error);
                },
              });
            },
            error: (error) => {
              console.error('There was an error uploading photos: ', error);
            },
          });
      }
    }
  }

  onSubmit(): void {
    if (this.authService.isLoggedIn()) {
      this.restaurantService.postRestaurant(this.restaurantDetails).subscribe({
        next: (data) => {
          this.uploadPhotos(data);
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
