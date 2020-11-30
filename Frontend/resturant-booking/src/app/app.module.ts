import { AuthService } from './auth.service';
import { SignupComponent } from './signup/signup.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';

import { RestaurantsService } from './restaurants.service';
import { RestaurantCardsComponent } from './restaurant-cards/restaurant-cards.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ValidateEqualModule } from 'ng-validate-equal';
import { LoginComponent } from './login/login.component';

import { AuthInterceptor } from './AuthInterceptor';
import { ForgotpassComponent } from './forgotpass/forgotpass.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RestaurantListingPageComponent } from './restaurant-listing-page/restaurant-listing-page.component';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import { ProfileButtonComponent } from './profile-button/profile-button.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    RestaurantCardsComponent,
    SignupComponent,
    LoginComponent,
    ForgotpassComponent,
    PasswordResetComponent,
    NavbarComponent,
    RestaurantListingPageComponent,
    RestaurantDetailsComponent,
    ProfileButtonComponent,
    UserProfileComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    ValidateEqualModule
  ],
  providers: [RestaurantsService, AuthService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
