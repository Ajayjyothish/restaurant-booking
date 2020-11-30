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
      },
      eror: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }

  onSubmit(formValue: object): void {
    this.serverError = '';
    console.log('Form value: ', formValue);

    const newDetails: object = {
      ...formValue,
    };
    console.log(newDetails);

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
