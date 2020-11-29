import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubCategorieComponent } from './add-sub-categorie.component';

describe('AddSubCategorieComponent', () => {
  let component: AddSubCategorieComponent;
  let fixture: ComponentFixture<AddSubCategorieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubCategorieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
