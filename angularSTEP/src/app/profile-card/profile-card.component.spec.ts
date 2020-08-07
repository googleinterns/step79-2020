import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ProfileCardComponent} from './profile-card.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card'
import {AppRoutingModule} from '../app-routing.module';

describe('ProfileCardComponent', () => {
  let component: ProfileCardComponent;
  let fixture: ComponentFixture<ProfileCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileCardComponent ],
      imports: [
        MatCardModule,
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
