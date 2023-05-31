import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAuthorComponent } from './all-author.component';

describe('AllAuthorComponent', () => {
  let component: AllAuthorComponent;
  let fixture: ComponentFixture<AllAuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllAuthorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
