import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="min-h-[70vh] text-black w-fit flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mx-auto"
    >
      <div class="w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Créer votre compte</h2>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <!-- Lastname -->
          <div>
            <label for="lastname" class="block text-sm font-medium text-gray-700"> Nom </label>
            <input
              id="lastname"
              type="text"
              formControlName="lastname"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="isFieldInvalid('lastname')"
            />
            @if (isFieldInvalid('lastname')) {
              <p class="mt-1 text-sm text-red-600">
                {{ getFieldError('lastname') }}
              </p>
            }
          </div>

          <!-- Firstname -->
          <div>
            <label for="firstname" class="block text-sm font-medium text-gray-700"> Prénom </label>
            <input
              id="firstname"
              type="text"
              formControlName="firstname"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="isFieldInvalid('firstname')"
            />
            @if (isFieldInvalid('firstname')) {
              <p class="mt-1 text-sm text-red-600">
                {{ getFieldError('firstname') }}
              </p>
            }
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="isFieldInvalid('email')"
            />
            @if (isFieldInvalid('email')) {
              <p class="mt-1 text-sm text-red-600">
                {{ getFieldError('email') }}
              </p>
            }
          </div>

          <!-- Address -->
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">
              Adresse postal
            </label>
            <input
              id="address"
              type="address"
              formControlName="address"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="isFieldInvalid('address')"
            />
            @if (isFieldInvalid('address')) {
              <p class="mt-1 text-sm text-red-600">
                {{ getFieldError('address') }}
              </p>
            }
          </div>

          <!-- City -->
          <div>
            <label for="city" class="block text-sm font-medium text-gray-700">
              Ville
            </label>
            <input
              id="city"
              type="city"
              formControlName="city"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="isFieldInvalid('city')"
            />
            @if (isFieldInvalid('city')) {
              <p class="mt-1 text-sm text-red-600">
                {{ getFieldError('city') }}
              </p>
            }
          </div>

          <!-- Code postal -->
          <div>
            <label for="postcode" class="block text-sm font-medium text-gray-700">
              Code postal
            </label>
            <input
              id="postcode"
              type="postcode"
              formControlName="postcode"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="isFieldInvalid('postcode')"
            />
            @if (isFieldInvalid('postcode')) {
              <p class="mt-1 text-sm text-red-600">
                {{ getFieldError('postcode') }}
              </p>
            }
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="isFieldInvalid('password')"
            />
            @if (isFieldInvalid('password')) {
              <p class="mt-1 text-sm text-red-600">
                {{ getFieldError('password') }}
              </p>
            }
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="isFieldInvalid('confirmPassword')"
            />
            @if (isFieldInvalid('confirmPassword')) {
              <p class="mt-1 text-sm text-red-600">
                {{ getFieldError('confirmPassword') }}
              </p>
            }
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              [disabled]="registerForm.invalid || loading()"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              @if (loading()) {
                <span
                  class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                ></span>
                Création en cours...
              } @else {
                Créer le compte
              }
            </button>
          </div>

          <!-- Error Message -->
          @if (error()) {
            <div class="bg-red-50 border border-red-200 rounded-md p-4">
              <p class="text-sm text-red-600">{{ error() }}</p>
            </div>
          }
        </form>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = signal(false);
  error = signal<string>('');

  constructor() {
    this.registerForm = this.fb.group(
      {
        lastname: ['', [Validators.required, Validators.minLength(2)]],
        firstname: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        address: ['', [Validators.required, Validators.minLength(6)]],
        city : ['', [Validators.required, Validators.minLength(2), this.noNumbersValidator]],
        postcode : ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading.set(true);
      this.error.set('');

      const userData = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.message || 'Erreur lors de la création du compte');
        },
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  noNumbersValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && /\d/.test(value)) {
      return { hasNumbers: true };
    }
    return null;
  }

  getFieldError(fieldName: string): string {
  const field = this.registerForm.get(fieldName);
  if (field?.errors) {
    if (field.errors['required']) return 'Ce champ est requis';
    if (field.errors['email']) return 'Format email invalide';
    if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    if (field.errors['pattern']) return 'Format invalide';
    if (field.errors['hasNumbers']) return 'Ce champ ne doit pas contenir de chiffres';
    if (field.errors['passwordMismatch']) return 'Les mots de passe ne correspondent pas';
  }
  return '';
}
}
