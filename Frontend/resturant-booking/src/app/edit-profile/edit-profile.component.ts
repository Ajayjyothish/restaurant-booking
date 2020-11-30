import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  profileDetails = null;
  imageFile = null;
  newImage = null;
  url = null;
  serverError = '';
  editPassword = {
    newPassword: '',
    confirmPassword: '',
  };

  isRequired = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data: Array<object>) => {
        this.profileDetails = data[0];
        this.url = this.profileDetails.profile_img;
      },
      eror: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  onFileSelect(event): any {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.url = event.target.result;
    };
    this.imageFile = file;
    this.newImage = file.name;
    console.log(this.newImage);
  }

  onSubmit(formValue: object): void {
    this.serverError = '';
    console.log('Form value: ', formValue);

    const newDetails: object = {
      ...formValue,
      uploadedImage:
        this.newImage == null
          ? this.profileDetails.profile_img
          : 'http://localhost:3000/my_uploaded_files/profile/' + this.newImage,
    };
    console.log(newDetails);

    if (this.imageFile !== null) {
      const formData = new FormData();
      formData.append('uploadedImage', this.imageFile);
      this.authService.updateProfleImage(formData, this.newImage).subscribe({
        next: (res) => {
          console.log('Profile Image Updated');
        },
        error: (error) => {
          console.error('There was an error: ', error);
        },
      });
    }

    this.authService.updateProfile(newDetails).subscribe({
      next: (res) => {
        console.log('Profile Updated');
        this.router.navigate(['profile']);
      },
      error: (error) => {
        console.error('There was an error: ', error);
        if (error.status === 403) {
          this.serverError = error.error;
        }
      },
    });
  }
}
