import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ViewProfilesComponent} from './view-profiles.component';
import {ProfileCardComponent} from '../profile-card/profile-card.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {RouterTestingModule} from '@angular/router/testing' ;
import {AngularFireAuthModule} from '@angular/fire/auth';

describe('ViewProfilesComponent', () => {
  let component: ViewProfilesComponent;
  let fixture: ComponentFixture<ViewProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewProfilesComponent, ProfileCardComponent ],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        RouterTestingModule
      ], providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
