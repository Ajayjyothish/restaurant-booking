import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  profileDetails = null;

  constructor(private authService: AuthService) {}

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

  onClick(): void {
    console.log('Edit clicked');
  }
}
