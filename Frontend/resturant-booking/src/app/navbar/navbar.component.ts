import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isNavbarCollapsed = true;
  isLoggedIn = this.authService.isLoggedIn();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
}
