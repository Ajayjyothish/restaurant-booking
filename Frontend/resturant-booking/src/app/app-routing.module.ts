import { PasswordResetComponent } from './password-reset/password-reset.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RestaurantListingPageComponent } from './restaurant-listing-page/restaurant-listing-page.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'response-reset-password/:token', component: PasswordResetComponent},
  {path: 'restaurant-list', component: RestaurantListingPageComponent},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
