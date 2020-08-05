import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import {BrowserModule} from '@angular/platform-browser';
// import {AngularFireModule} from '@angular/fire';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import { UploadRecipeComponent } from './upload-recipe.component';
// import {environment} from '../../environments/environment';
// import {AngularFirestoreModule} from '@angular/fire/firestore';
// import {RouterTestingModule} from '@angular/router/testing' ;
// import {FormArray, FormBuilder, FormControl, FormGroup, Validators, FormGroupDirective, ReactiveFormsModule} from '@angular/forms';
// // import {ReactiveFormsModule} from '@angular/forms';
// import {MatAutocompleteModule} from '@angular/material/autocomplete';
// import {MatStepperModule} from '@angular/material/stepper';
// import {MatFormFieldModule} from '@angular/material/form-field'
// import { MatSelectModule } from '@angular/material/select';
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadRecipeComponent ],
      imports: [
          BrowserModule,
          BrowserAnimationsModule,
          AngularFireModule.initializeApp(environment.firebase),
          AngularFirestoreModule,
          RouterTestingModule,
          ReactiveFormsModule,
          // MatAutocompleteModule,
          MatButtonModule,
          MatFormFieldModule,
          MatIconModule,
          MatInputModule,
          MatSelectModule,
          MatStepperModule
        //   FormBuilder,
        //   FormArray,
        //   FormControl,
        //   Validators,
        //   FormGroupDirective,
      ],
      providers: [
        FormBuilder,
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
});
