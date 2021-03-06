import { HomepageModule } from './homepage/homepage.module';
import { AuthService } from './auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';

import { RestaurantsService } from './restaurants.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ValidateEqualModule } from 'ng-validate-equal';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { AgmCoreModule } from '@agm/core';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';

import { AuthInterceptor } from './AuthInterceptor';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RestaurantListingPageComponent } from './restaurant-listing-page/restaurant-listing-page.component';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MyRestaurantsComponent } from './my-restaurants/my-restaurants.component';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';
import { EditRestaurantComponent } from './edit-restaurant/edit-restaurant.component';
import { EditPhotosComponent } from './edit-photos/edit-photos.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { EditMenusComponent } from './edit-menus/edit-menus.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    PasswordResetComponent,
    NavbarComponent,
    RestaurantListingPageComponent,
    RestaurantDetailsComponent,
    UserProfileComponent,
    EditProfileComponent,
    MyRestaurantsComponent,
    AddRestaurantComponent,
    EditRestaurantComponent,
    EditPhotosComponent,
    FavoritesComponent,
    EditMenusComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ValidateEqualModule,
    InfiniteScrollModule,
    HomepageModule,
    NgxGalleryModule,
    SocialLoginModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD1pTe0e5PhkfAA6DsOz2rL0Qq8etBGaxc',
    }),
  ],
  providers: [
    RestaurantsService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '990650584307-5c64v96cqp4pat4h8uitavc6fm055r13.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1039503179901777')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
