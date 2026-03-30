import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Silos } from './silos';

describe('Silos', () => {
  let component: Silos;
  let fixture: ComponentFixture<Silos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Silos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Silos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
