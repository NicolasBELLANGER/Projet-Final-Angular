import { Directive, ElementRef, inject, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appLowPrice]',
  standalone: true,
})
export class LowPriceDirective implements OnInit {
  @Input() appLowPrice!: number;

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnInit() {
    if (this.appLowPrice < 150) {
      const badge = this.renderer.createElement('span');
      this.renderer.setProperty(badge, 'textContent', 'Bon plan');
      this.renderer.setStyle(badge, 'backgroundColor', 'blue');
      this.renderer.setStyle(badge, 'color', 'white');
      this.renderer.setStyle(badge, 'padding', '2px 6px');
      this.renderer.setStyle(badge, 'borderRadius', '4px');
      this.renderer.setStyle(badge, 'marginLeft', '8px');
      this.renderer.setStyle(badge, 'fontSize', '0.75rem');
      this.renderer.appendChild(this.el.nativeElement, badge);
    }
  }
}
