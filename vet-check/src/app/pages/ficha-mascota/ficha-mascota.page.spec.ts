import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FichaMascotaPage } from './ficha-mascota.page';

describe('FichaMascotaPage', () => {
  let component: FichaMascotaPage;
  let fixture: ComponentFixture<FichaMascotaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FichaMascotaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
