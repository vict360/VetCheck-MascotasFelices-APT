import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialProcedimientosPage } from './historial-procedimientos.page';

describe('HistorialProcedimientosPage', () => {
  let component: HistorialProcedimientosPage;
  let fixture: ComponentFixture<HistorialProcedimientosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HistorialProcedimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
