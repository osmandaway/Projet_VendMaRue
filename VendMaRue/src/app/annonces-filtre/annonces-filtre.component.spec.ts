import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoncesFiltreComponent } from './annonces-filtre.component';

describe('AnnoncesFiltreComponent', () => {
  let component: AnnoncesFiltreComponent;
  let fixture: ComponentFixture<AnnoncesFiltreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnoncesFiltreComponent]
    });
    fixture = TestBed.createComponent(AnnoncesFiltreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
