import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchingRecipeFormComponent } from './branching-recipe-form.component';

describe('BranchingRecipeFormComponent', () => {
  let component: BranchingRecipeFormComponent;
  let fixture: ComponentFixture<BranchingRecipeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchingRecipeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchingRecipeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
