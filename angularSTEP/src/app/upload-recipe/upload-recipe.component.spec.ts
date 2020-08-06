import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {UploadRecipeComponent} from '../upload-recipe/upload-recipe.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule, AngularFireStorage} from '@angular/fire/storage';
import {RouterTestingModule} from '@angular/router/testing' ;
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {AngularFireAuthModule, AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder} from '@angular/forms';
import {HarnessLoader} from '@angular/cdk/testing';
import {Observable, of} from 'rxjs';
import {MatButtonHarness} from '@angular/material/button/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';


describe('UploadRecipeComponent', () => {
  let component: UploadRecipeComponent;
  let fixture: ComponentFixture<UploadRecipeComponent>;


const AngularStorageStub = {
    ref: jasmine.createSpy('ref').and.returnValue({
        put: jasmine.createSpy('put').withArgs(new Blob()).and.returnValue(Promise.resolve())
        .withArgs("noImage").and.returnValue("hello"),
        getDownloadURL : jasmine.createSpy('getDownloadURL').and.returnValue(of('url'))
    }),
}

const goodUserStub = {
    user: {
      picUrl: "testPicUrl",
      uid: "gooduid"
    }
}

const fAuthStub = {
    currentUser: Promise.resolve(goodUserStub),
    onAuthStateChanged: jasmine.createSpy('onAuthStateChanged').and.returnValue(goodUserStub)
  }

describe('UploadRecipeComponent', () => {
  let component: UploadRecipeComponent;
  let fixture: ComponentFixture<UploadRecipeComponent>;
  let loader: HarnessLoader;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadRecipeComponent ],
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        RouterTestingModule,
        MatInputModule,
        MatChipsModule,
        MatSelectModule,
        MatStepperModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule
      ], providers: [FormBuilder,
        {provide: AngularFireStorage, useValue: AngularStorageStub},
        {provide: AngularFireAuth, useValue: fAuthStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addImage correct amount of times', async () => {
    component.imageFiles = Array(4).fill(new Blob());
    spyOn(component, "addImage");
    await component.setUrls();
    expect(component.addImage).toHaveBeenCalledTimes(4);
  })

  it('should call addImage correct amount of times', async () => {
    component.imageFiles = Array(4).fill(new Blob());
    spyOn(component, "addImage");
    await component.setUrls();
    expect(component.addImage).toHaveBeenCalledTimes(4);
  })

  it('should add image to imageUrls', async () => {
    component.imageFiles = [new Blob()];
    await component.addImage(new Blob(), '123');
    expect(component.imageUrls).toEqual(['url']);
  })

  it('adds 4 urls to imageUrls', async () => {
    component.imageFiles = Array(4).fill(new Blob());
    await component.setUrls();
    expect(component.imageUrls).toEqual(Array(4).fill('url'));
  })


});
