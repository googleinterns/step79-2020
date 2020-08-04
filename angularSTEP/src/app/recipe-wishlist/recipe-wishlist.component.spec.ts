import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeWishlistComponent } from './recipe-wishlist.component';

describe('RecipeWishlistComponent', () => {
  let component: RecipeWishlistComponent;
  let fixture: ComponentFixture<RecipeWishlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeWishlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
