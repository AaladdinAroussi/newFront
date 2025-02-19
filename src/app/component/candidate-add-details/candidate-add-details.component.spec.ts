import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateAddDetailsComponent } from './candidate-add-details.component';

describe('CandidateAddDetailsComponent', () => {
  let component: CandidateAddDetailsComponent;
  let fixture: ComponentFixture<CandidateAddDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateAddDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateAddDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
