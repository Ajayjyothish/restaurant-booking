import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantsService } from '../restaurants.service';

@Component({
  selector: 'app-edit-menus',
  templateUrl: './edit-menus.component.html',
  styleUrls: ['./edit-menus.component.css'],
})
export class EditMenusComponent implements OnInit {
  restaurantId = null;
  restaurantMenus = [];

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantsService
  ) {
    this.route.params.subscribe((params) => {
      this.restaurantId = params.restaurantId;
    });
  }

  ngOnInit(): void {
    this.getMenus();
  }

  onFileSelect(event): void {
    for (const file of event.target.files) {
      const formData = new FormData();
      formData.append('uploadedImage', file);
      this.restaurantService
        .uploadFile(formData, this.restaurantId, file.name)
        .subscribe({
          next: () => {
            console.log('Restaurant Menus added');
            const photo = {
              url: `http://localhost:3000/my_uploaded_files/restaurants/${this.restaurantId}/${file.name}`,
              restaurantId: this.restaurantId,
            };
            this.restaurantService.postMenus(photo).subscribe({
              next: (dbResponse) => {
                console.log(dbResponse);
                this.getMenus();
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

  deleteMenu(id): void {
    this.restaurantService.deleteMenu(id).subscribe({
      next: (data) => {
        console.log(data);
        this.getMenus();
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  getMenus(): void {
    this.restaurantService.getMenus(this.restaurantId).subscribe({
      next: (data: Array<any>) => {
        this.restaurantMenus = data;
      },
      error: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }
}
