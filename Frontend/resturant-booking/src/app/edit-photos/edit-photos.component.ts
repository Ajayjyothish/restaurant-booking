import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantsService } from '../restaurants.service';

@Component({
  selector: 'app-edit-photos',
  templateUrl: './edit-photos.component.html',
  styleUrls: ['./edit-photos.component.css'],
})
export class EditPhotosComponent implements OnInit {
  restaurantId = null;
  restaurantImages = [];
  myfiles = [];

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantsService
  ) {
    this.route.params.subscribe((params) => {
      this.restaurantId = params.restaurantId;
    });
  }

  ngOnInit(): void {
    this.getPhotos();
  }

  onFileSelect(event): void {
    for (const file of event.target.files) {
      const formData = new FormData();
      formData.append('uploadedImage', file);
      this.restaurantService
        .uploadFile(formData, this.restaurantId, file.name)
        .subscribe({
          next: () => {
            console.log('Restaurant photos added');
            const photo = {
              url: `http://localhost:3000/my_uploaded_files/restaurants/${this.restaurantId}/${file.name}`,
              restaurantId: this.restaurantId,
            };
            this.restaurantService.postPhotos(photo).subscribe({
              next: (dbResponse) => {
                console.log(dbResponse);
                this.getPhotos();
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

  deletePhoto(id): void {
    this.restaurantService.deletePhoto(id).subscribe({
      next: (data) => {
        console.log(data);
        this.getPhotos();
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  getPhotos(): void {
    this.restaurantService.getPhotos(this.restaurantId).subscribe({
      next: (data: Array<any>) => {
        this.restaurantImages = data;
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }
}
