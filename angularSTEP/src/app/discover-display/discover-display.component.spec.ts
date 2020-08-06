import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverDisplayComponent } from './discover-display.component';

describe('DiscoverDisplayComponent', () => {
  let component: DiscoverDisplayComponent;
  let fixture: ComponentFixture<DiscoverDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
