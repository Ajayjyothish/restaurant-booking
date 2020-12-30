import { EditMenusComponent } from './edit-menus/edit-menus.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { EditPhotosComponent } from './edit-photos/edit-photos.component';
import { EditRestaurantComponent } from './edit-restaurant/edit-restaurant.component';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';
import { MyRestaurantsComponent } from './my-restaurants/my-restaurants.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AuthGuardService } from './auth-guard.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RestaurantListingPageComponent } from './restaurant-listing-page/restaurant-listing-page.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./homepage/homepage.module').then((m) => m.HomepageModule),
  },
  { path: 'response-reset-password/:token', component: PasswordResetComponent },
  {
    path: 'restaurant-list/:city/:filterCategory',
    component: RestaurantListingPageComponent,
  },
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
  {
    path: 'my-restaurants',
    component: MyRestaurantsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'add-restaurant',
    component: AddRestaurantComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit-restaurant/:restaurantId',
    component: EditRestaurantComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit-photos/:restaurantId',
    component: EditPhotosComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit-menus/:restaurantId',
    component: EditMenusComponent,
    canActivate: [AuthGuardService],
  },

  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
