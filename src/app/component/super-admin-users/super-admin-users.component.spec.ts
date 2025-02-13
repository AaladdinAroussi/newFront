import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminUsersComponent } from './super-admin-users.component';

describe('SuperAdminUsersComponent', () => {
  let component: SuperAdminUsersComponent;
  let fixture: ComponentFixture<SuperAdminUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
