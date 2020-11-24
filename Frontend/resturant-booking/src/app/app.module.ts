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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    RestaurantCardsComponent,
    SignupComponent,
    LoginComponent,
    ForgotpassComponent,
    PasswordResetComponent
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
