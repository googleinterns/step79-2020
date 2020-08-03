import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProfileImgComponent } from './change-profile-img.component';

describe('ChangeProfileImgComponent', () => {
  let component: ChangeProfileImgComponent;
  let fixture: ComponentFixture<ChangeProfileImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeProfileImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeProfileImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
