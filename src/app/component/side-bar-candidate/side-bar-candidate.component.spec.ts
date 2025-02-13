import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarCandidateComponent } from './side-bar-candidate.component';

describe('SideBarCandidateComponent', () => {
  let component: SideBarCandidateComponent;
  let fixture: ComponentFixture<SideBarCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideBarCandidateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBarCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
