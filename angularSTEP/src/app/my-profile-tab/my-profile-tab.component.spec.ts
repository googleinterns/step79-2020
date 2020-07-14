import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileTabComponent } from './my-profile-tab.component';

describe('MyProfileTabComponent', () => {
  let component: MyProfileTabComponent;
  let fixture: ComponentFixture<MyProfileTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProfileTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
