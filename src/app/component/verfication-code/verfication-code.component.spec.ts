import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerficationCodeComponent } from './verfication-code.component';

describe('VerficationCodeComponent', () => {
  let component: VerficationCodeComponent;
  let fixture: ComponentFixture<VerficationCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerficationCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerficationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
