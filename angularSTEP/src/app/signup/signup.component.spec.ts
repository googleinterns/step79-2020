import { async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {SignupComponent} from './signup.component';
import {BrowserModule, By} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs'
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {AngularFirestoreModule, AngularFirestore} from '@angular/fire/firestore';
import {RouterTestingModule} from '@angular/router/testing' ;
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {FormBuilder} from '@angular/forms';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let loader: HarnessLoader;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupComponent ],
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        MatTabsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        RouterTestingModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule
      ], providers: [FormBuilder]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should set hide to false", async () => {
    const hidebutton = fixture.debugElement.nativeElement.querySelector("#hide-button");
    hidebutton.click();
    expect(component.hide).toBeFalsy();
  })

  it("should not call onSubmit", async () => {
    fixture.detectChanges();
    const submitButton = await loader.getHarness(MatButtonHarness.with({selector: '.submit-button'}));
    expect(await submitButton.isDisabled()).toBeTruthy();
    spyOn(component, "onSubmit");
    await submitButton.click();
    expect(component.onSubmit).toHaveBeenCalledTimes(0);
  })

  it('form should be invalid because of email', async () => {
    component.signUpForm.controls['displayName'].setValue("oliverlance");
    component.signUpForm.controls['username'].setValue("ollylance15");
    component.signUpForm.controls['email'].setValue("hello");
    component.signUpForm.controls['password'].setValue("bigboithings");
    expect(component.signUpForm.valid).toBeFalsy();
  })

  it('form should be invalid because of username', async () => {
    component.signUpForm.controls['displayName'].setValue("oliverlance");
    component.signUpForm.controls['username'].setValue("ollylance15");
    component.signUpForm.controls['email'].setValue("hello");
    component.signUpForm.controls['password'].setValue("bigboithings");
    expect(component.signUpForm.valid).toBeFalsy();
  })

  it('form should be invalid because of username min length', async () => {
    component.signUpForm.controls['displayName'].setValue("oliverlance");
    component.signUpForm.controls['username'].setValue("ol");
    component.signUpForm.controls['email'].setValue("hello@gmail.com");
    component.signUpForm.controls['password'].setValue("bigboithings");
    expect(component.signUpForm.valid).toBeFalsy();
  })

  it('form should be invalid because of username max length', async () => {
    component.signUpForm.controls['displayName'].setValue("oliverlance");
    component.signUpForm.controls['username'].setValue("olsdfgfsdgfdsgfdgfdsgfdgfsdgfsdgfgsfgfdsgfsdgfsd");
    component.signUpForm.controls['email'].setValue("hello@gmail.com");
    component.signUpForm.controls['password'].setValue("bigboithings");
    expect(component.signUpForm.valid).toBeFalsy();
  })

  it('form should be valid', async () => {
    component.signUpForm.controls['displayName'].setValue("oliverlance");
    component.signUpForm.controls['username'].setValue("olly");
    component.signUpForm.controls['email'].setValue("hello@gmail.com");
    component.signUpForm.controls['password'].setValue("bigboithings");
    expect(component.signUpForm.valid).toBeTruthy();
  })

  it('button should be enabled if form valid', async () => {
    component.signUpForm.controls['displayName'].setValue("oliverlance");
    component.signUpForm.controls['username'].setValue("oliver");
    component.signUpForm.controls['email'].setValue("hello@gmail.com");
    component.signUpForm.controls['password'].setValue("bigboithings");
    const submitButton = await loader.getHarness(MatButtonHarness.with({selector: '.submit-button'}));
    expect(await submitButton.isDisabled()).toBeFalsy();
  })

  it('should be disabled if form is not valid', async() => {
    component.signUpForm.controls['displayName'].setValue("oliverlance");
    component.signUpForm.controls['username'].setValue("ol");
    component.signUpForm.controls['email'].setValue("hello@gmail.com");
    component.signUpForm.controls['password'].setValue("bigboithings");
    const submitButton = await loader.getHarness(MatButtonHarness.with({selector: '.submit-button'}));
    expect(await submitButton.isDisabled()).toBeTruthy();
  })

  it("should submit onSubmit", async () => {
    fixture.detectChanges();
    component.signUpForm.controls['displayName'].setValue("oliverlance");
    component.signUpForm.controls['username'].setValue("oliver");
    component.signUpForm.controls['email'].setValue("hello@gmail.com");
    component.signUpForm.controls['password'].setValue("bigboithings");
    const submitButton = await loader.getHarness(MatButtonHarness.with({selector: '.submit-button'}));
    expect(await submitButton.isDisabled()).toBeFalsy();
    spyOn(component, "onSubmit");
    await submitButton.click();
    expect(component.onSubmit).toHaveBeenCalledTimes(1);
  })

  it('should throw error if onSubmit and not valid', async () => {
    component.onSubmit();
    expect(component.error).toBe('Please make sure the form is filled out correctly');
  })

});
