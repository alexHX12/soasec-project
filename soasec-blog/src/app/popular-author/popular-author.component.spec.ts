import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularAuthorComponent } from './popular-author.component';

describe('PopularAuthorComponent', () => {
  let component: PopularAuthorComponent;
  let fixture: ComponentFixture<PopularAuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopularAuthorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
