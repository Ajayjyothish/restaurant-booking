import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AuthGuardService } from './auth-guard.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RestaurantListingPageComponent } from './restaurant-listing-page/restaurant-listing-page.component';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./homepage/homepage.module').then(m => m.HomepageModule) },
  { path: 'response-reset-password/:token', component: PasswordResetComponent },
  { path: 'restaurant-list/:filterCategory', component: RestaurantListingPageComponent },
  {
    path: 'restaurant-details/:restaurantId',
    component: RestaurantDetailsComponent,
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [AuthGuardService],
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
