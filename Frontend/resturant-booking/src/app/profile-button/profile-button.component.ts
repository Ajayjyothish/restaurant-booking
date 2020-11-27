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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.profileName = this.authService.getUser().split(' ')[0];
    this.profileImage = this.authService.getProfileImage();
  }
  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl(this.router.url).then(() => {
      window.location.reload();
    });
  }
}
