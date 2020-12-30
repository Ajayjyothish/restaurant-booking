import { ForgotpassComponent } from './../forgotpass/forgotpass.component';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from '../signup/signup.component';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { RestaurantsService } from '../restaurants.service';

interface SigninUser {
  email: string;

  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user: SigninUser;
  serverError = '';

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private restaurantService: RestaurantsService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';
  }

  signIn(socialProvider: string): void {
    console.log(socialProvider);

    let socialPlatformProvider;
    if (socialProvider === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else if (socialProvider === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then((user) => {
      this.restaurantService.socialUser(user).subscribe({
        next: (res) => {
          this.authService.setSession(res);
          this.router.navigateByUrl(this.router.url);
          this.resetForm();
        },
        error: (error) => {
          console.error('Google signin error: ', error.error);
          if (error.status === 403) {
            this.serverError = error.error;
          }
        },
      });
    });
  }

  ngOnInit(): void {
    this.user = {
      email: '',
      password: '',
    };
  }

  log(x: object): any {
    console.log(x);
  }

  onSubmit(signinUser: SigninUser, valid: boolean): void {
    this.serverError = '';
    this.authService.login(signinUser).subscribe({
      next: (res) => {
        this.authService.setSession(res);
        this.router.navigateByUrl(this.router.url);
        this.resetForm();
      },
      error: (error) => {
        console.error('There was an error: ', error.error);
        if (error.status === 403) {
          this.serverError = error.error;
        }
      },
    });
  }

  resetForm(): void {
    this.modalService.dismissAll();
    setTimeout(() => {
      this.user = {
        email: '',
        password: '',
      };
    }, 1000);
  }

  open(content: any): any {
    this.modalService.open(content, { windowClass: 'my-class' });
  }

  signup(): void {
    this.modalService.dismissAll();
    this.modalService.open(SignupComponent, { windowClass: 'my-class' });
  }

  forgot(): void {
    this.modalService.dismissAll();
    this.modalService.open(ForgotpassComponent, { windowClass: 'my-class' });
  }
}
