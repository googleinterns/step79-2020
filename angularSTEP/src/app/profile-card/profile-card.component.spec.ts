import { async, ComponentFixture, TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';

import { By } from '@angular/platform-browser';

import { ProfileCardComponent } from './profile-card.component';

describe('ProfileCardComponent', () => {
    let component: ProfileCardComponent;
    let fixture: ComponentFixture<ProfileCardComponent>;
    let de: DebugElement;

    beforeEach(async(() =>{
        TestBed.configureTestingModule({
            declarations: [ ProfileCardComponent ],

        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileCardComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be a string', () =>{
        expect(component.displayName).toBeInstanceOf(String);
        expect(component.picUrl).toBeInstanceOf(String);
        expect(component.username).toBeInstanceOf(String);
    });
});