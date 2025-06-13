import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MycityPage } from './mycity.page';

describe('MycityPage', () => {
  let component: MycityPage;
  let fixture: ComponentFixture<MycityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MycityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
