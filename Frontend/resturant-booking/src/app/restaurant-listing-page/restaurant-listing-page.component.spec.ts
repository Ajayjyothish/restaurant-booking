import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantListingPageComponent } from './restaurant-listing-page.component';

describe('RestaurantListingPageComponent', () => {
  let component: RestaurantListingPageComponent;
  let fixture: ComponentFixture<RestaurantListingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantListingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantListingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
