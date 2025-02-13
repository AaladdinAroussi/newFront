import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminOffersComponent } from './super-admin-offers.component';

describe('SuperAdminOffersComponent', () => {
  let component: SuperAdminOffersComponent;
  let fixture: ComponentFixture<SuperAdminOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminOffersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
