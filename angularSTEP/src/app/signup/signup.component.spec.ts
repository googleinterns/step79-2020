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
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {AngularFireAuthModule, AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder} from '@angular/forms';


const docExists = {exists: true};
const docDoesntExist = {exists: false};
const AngularFirestoreStub = {
  doc: jasmine.createSpy('doc').withArgs("/usernames/exists/").and.returnValue({
    ref: {
      get: jasmine.createSpy('get').and.returnValue(Promise.resolve(docExists))
    }
  }).withArgs("/usernames/doesntexist/").and.returnValue({
    ref: {
      get: jasmine.createSpy('get').and.returnValue(Promise.resolve(docDoesntExist))
    }
  }),
  collection: jasmine.createSpy('collection').withArgs('users').and.returnValue({
    doc: jasmine.createSpy('doc').withArgs('gooduid').and.returnValue({
      ref: {
        withConverter: jasmine.createSpy('withConverter').and.returnValue({
          set: jasmine.createSpy('set').and.returnValue(Promise.resolve())
        })
      }
    }).withArgs('baduid').and.returnValue({
      ref: {
        withConverter: jasmine.createSpy('withConverter').and.returnValue({
          set: jasmine.createSpy('set').and.returnValue(Promise.reject("reject"))
        })
      }
    })
  }).withArgs('usernames').and.returnValue({
    doc: jasmine.createSpy('doc').withArgs("doesntexist").and.returnValue({
      ref: {
        withConverter: jasmine.createSpy('withConverter').and.returnValue({
          set: jasmine.createSpy('set').and.returnValue(Promise.resolve())
        })
      }
    }).withArgs("/usernames/exists/").and.returnValue({
      ref: {
        withConverter: jasmine.createSpy('withConverter').and.returnValue({
          set: jasmine.createSpy('set').and.returnValue(Promise.reject("reject"))
        })
      }
    })
  })
}

const goodUserStub1 = {
  user: {
    picUrl: "testPicUrl",
    uid: "gooduid"
  }
}

const goodUserStub2 = {
  user: {
    picUrl: "",
    uid: "gooduid"
  }
}

const badUserStub = {
  user: {
    picUrl: null,
    uid: "baduid"
  },
  delete: jasmine.createSpy('delete')
}

const nullUserStub = {
  user: null
};

const routerMock = {
  navigate: jasmine.createSpy('navigate')
}

const fAuthStub = {
  createUserWithEmailAndPassword: jasmine.createSpy('createUserWithEmailAndPassword')
  .withArgs("good@email1", "goodpassword1").and.returnValue(Promise.resolve(goodUserStub1))
  .withArgs("good@email2", "goodpassword2").and.returnValue(Promise.resolve(goodUserStub2))
  .withArgs("bad@email1", "badpassword1").and.returnValue(Promise.resolve(badUserStub))
  .withArgs("bad@email2", "badpassword2").and.returnValue(Promise.resolve(nullUserStub))
  .withArgs("bad@email3", "badpassword3").and.returnValue(Promise.reject("reject")),
  currentUser: Promise.resolve(badUserStub)
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let loader: HarnessLoader;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupComponent],
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
      ], providers: [
        FormBuilder,
        {provide: AngularFirestore, useValue: AngularFirestoreStub},
        {provide: AngularFireAuth, useValue: fAuthStub},
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();
  }));

  async function resetSpys(){
    fAuthStub.createUserWithEmailAndPassword.calls.reset();
    AngularFirestoreStub.doc.calls.reset();
    badUserStub.delete.calls.reset();
    AngularFirestoreStub.collection.calls.reset();
    routerMock.navigate.calls.reset();
  }

  async function setForm(displayName: string, username: string, email: string, password: string){
    component.signUpForm.controls['displayName'].setValue(displayName);
    component.signUpForm.controls['username'].setValue(username);
    component.signUpForm.controls['email'].setValue(email);
    component.signUpForm.controls['password'].setValue(password);
  }

  beforeEach(async () => {
    fixture = TestBed.createComponent(SignupComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    resetSpys();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should set hide to false", async () => {
    fixture.detectChanges();
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
    await setForm("oliverlance", "ollylance15", "email", "password");
    expect(component.signUpForm.valid).toBeFalsy();
  })

  it('form should be invalid because of username min length', async () => {
    await setForm("oliverlance", "ol", "email@email.com", "password");
    expect(component.signUpForm.valid).toBeFalsy();
  })

  it('form should be invalid because of username max length', async () => {
    await setForm("oliverlance", "olfgdgsgdfsfdgdsfdsgfggfddddddd", "email@email.com", "password");
    expect(component.signUpForm.valid).toBeFalsy();
  })

  it('form should be valid', async () => {
    await setForm("oliverlance", "olly", "email@email.com", "password");
    expect(component.signUpForm.valid).toBeTruthy();
  })

  it('button should be enabled if form valid', async () => {
    await setForm("oliverlance", "olly", "email@email.com", "password");
    const submitButton = await loader.getHarness(MatButtonHarness.with({selector: '.submit-button'}));
    expect(await submitButton.isDisabled()).toBeFalsy();
  })

  it('should be disabled if form is not valid', async() => {
    await setForm("oliverlance", "ol", "email@email.com", "password");
    const submitButton = await loader.getHarness(MatButtonHarness.with({selector: '.submit-button'}));
    expect(await submitButton.isDisabled()).toBeTruthy();
  })

  it("should call onSubmit", async () => {
    fixture.detectChanges();
    await setForm("oliverlance", "oliver", "email@email.com", "password");
    const submitButton = await loader.getHarness(MatButtonHarness.with({selector: '.submit-button'}));
    expect(await submitButton.isDisabled()).toBeFalsy();
    spyOn(component, "onSubmit");
    await submitButton.click();
    expect(component.onSubmit).toHaveBeenCalledTimes(1);
  })

  it('should throw error if calls onSubmit and not valid', async () => {
    component.onSubmit();
    expect(component.error).toBe('Please make sure the form is filled out correctly');
  })

  it('should throw error if username exists', async () => {
    await setForm("oliverlance", "exists", "email@email.com", "password");
    await component.onSubmit();
    expect(component.error).toBe('Username ' + 'exists' + ' already taken.');
    expect(routerMock.navigate).not.toHaveBeenCalledWith(['/home']);
  })

  it('should create user and navigate to home', async () => {
    await setForm("oliverlance", "doesntexist", "good@email1", "goodpassword1");
    await component.onSubmit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  })

  it('should create user with empty picUrl and navigate to home', async () => {
    await setForm("oliverlance", "doesntexist", "good@email2", "goodpassword2");
    await component.onSubmit();
    expect(component.picUrl = "assets/images/blank-profile.png")
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  })

  it('should not create user because of bad uid', async () => {
    await setForm("oliverlance", "doesntexist", "bad@email1", "badpassword1");
    await component.onSubmit();
    expect(routerMock.navigate).not.toHaveBeenCalledWith(['/home']);
    expect(component.error).toBe('User not created. Please try again.');
    expect(badUserStub.delete).toHaveBeenCalled();
  })

  it('should try to create user but its null', async () => {
    await setForm("oliverlance", "doesntexist", "bad@email2", "badpassword2");
    await component.onSubmit();
    expect(routerMock.navigate).not.toHaveBeenCalledWith(['/home']);
    expect(component.error).toBe('User not created. Please try again.')
  })

  it('should not create user', async () => {
    await setForm("oliverlance", "doesntexist", "bad@email3", "badpassword3");
    await component.onSubmit();
    expect(routerMock.navigate).not.toHaveBeenCalledWith(['/home']);
    expect(component.error).toBe('User not created. Please try again.');
    expect(badUserStub.delete).toHaveBeenCalled();
  })
});
