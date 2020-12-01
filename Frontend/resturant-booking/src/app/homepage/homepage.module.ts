import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageRoutingModule } from './homepage-routing.module';
import { HomepageComponent } from './homepage.component';
import { HomeComponent } from '../home/home.component';
import { ForgotpassComponent } from '../forgotpass/forgotpass.component';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ValidateEqualModule } from 'ng-validate-equal';
import { RestaurantCardsComponent } from '../restaurant-cards/restaurant-cards.component';


@NgModule({
  declarations: [HomepageComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    ForgotpassComponent,
    RestaurantCardsComponent,



  ],
  imports: [
    CommonModule,
    HomepageRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ValidateEqualModule


  ]
})
export class HomepageModule { }
