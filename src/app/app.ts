import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
   <div class="min-h-dvh flex flex-col">
    <app-header></app-header>
    <main class="container mx-auto p-4 flex-1">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  </div>
  `,
  styles: [],
})
export class App {
  title = 'SneakPeak';
}
