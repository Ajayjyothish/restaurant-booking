import { AuthGuardService } from './auth-guard.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RestaurantListingPageComponent } from './restaurant-listing-page/restaurant-listing-page.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'response-reset-password/:token', component: PasswordResetComponent},
  {path: 'restaurant-list', component: RestaurantListingPageComponent},
  {path: 'restaurant-details/:restaurantId', component: RestaurantDetailsComponent},
  {path: 'profile', component: UserProfileComponent, canActivate: [AuthGuardService]},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
