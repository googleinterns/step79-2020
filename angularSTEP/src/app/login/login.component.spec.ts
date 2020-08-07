import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {SetupComponent} from '../setup/setup.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormBuilder} from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AppRoutingModule} from '../app-routing.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent, SetupComponent ],
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AppRoutingModule
      ], providers: [FormBuilder]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
