import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarSuperAdminComponent } from './side-bar-super-admin.component';

describe('SideBarSuperAdminComponent', () => {
  let component: SideBarSuperAdminComponent;
  let fixture: ComponentFixture<SideBarSuperAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideBarSuperAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBarSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
