import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-button',
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.css'],
})
export class ProfileButtonComponent implements OnInit {
  profileName;
  profileImage;

  constructor(private authService: AuthService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data: Array<any>) => {
        this.profileName = data[0].name.split(' ')[0];
        this.profileImage = data[0].profile_img;
      },
      eror: (error) => {
        console.error('There was an error: ', error);
      },
    });
  }
  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl(this.router.url);
  }
}
