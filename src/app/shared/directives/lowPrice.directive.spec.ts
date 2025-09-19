import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LowPriceDirective } from './lowPrice.directive';

@Component({
  standalone: true,
  template: `
    <div id="price1" [appLowPrice]="100">Produit 1</div>
    <div id="price2" [appLowPrice]="200">Produit 2</div>
  `,
  imports: [LowPriceDirective],
})
class TestComponent {}

describe('LowPriceDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should add "Bon plan" badge when price < 150', () => {
    const el = fixture.debugElement.query(By.css('#price1'));
    const badge = el.nativeElement.querySelector('span');

    expect(badge).toBeTruthy();
    expect(badge.textContent).toBe('Bon plan');
    expect(badge.style.backgroundColor).toBe('blue');
  });

  it('should not add badge when price >= 150', () => {
    const el = fixture.debugElement.query(By.css('#price2'));
    const badge = el.nativeElement.querySelector('span');

    expect(badge).toBeNull();
  });
});
