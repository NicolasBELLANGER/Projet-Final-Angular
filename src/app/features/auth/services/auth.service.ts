import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  public readonly _currentUser = this.currentUser.asReadonly();

  private defaultUsers: User[] = [
    {
      id: 1,
      lastname: 'Admin',
      firstname: 'Admin',
      email: 'admin@example.com',
      address: '3 Avenue de la Plage',
      city: 'Paris',
      postcode: '75016',
      role: 'admin',
    },
    {
      id: 2,
      lastname: 'User',
      firstname: 'User',
      email: 'user@example.com',
      address: '3 Avenue de la Montagne',
      city: 'Paris',
      postcode: '75016',
      role: 'user',
    },
  ];

  private defaultPasswords: Record<string, string> = {
    'admin@example.com': 'admin123',
    'user@example.com': 'user123',
  };

  private users: User[] = [...this.defaultUsers];
  private passwords: Record<string, string> = { ...this.defaultPasswords };

  constructor() {
    this.loadUserFromStorage();
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find((u) => u.email === credentials.email);
    const password = this.passwords[credentials.email];

    if (user && password === credentials.password) {
      return of(user).pipe(delay(500));
    } else {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  register(userData: RegisterRequest): Observable<User> {
    const existingUser = this.users.find((u) => u.email === userData.email);
    if (existingUser) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    const newUser: User = {
      id: this.users.length + 1,
      lastname: userData.lastname,
      firstname: userData.firstname,
      email: userData.email,
      address: userData.address,
      city: userData.city,
      postcode: userData.postcode,
      role: 'user',
    };

    // Ajouter aux mock data
    this.users.push(newUser);
    this.passwords[userData.email] = userData.password;
    this.saveUserToStorage();

    return of(newUser).pipe(delay(500));
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');}

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getAllUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(300));
  }

  deleteUser(userId: number): Observable<void> {
    const index = this.users.findIndex((u) => u.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
      return of(void 0).pipe(delay(300));
    }
    return throwError(() => new Error('Utilisateur non trouvé'));
  }

  private saveUserToStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
    localStorage.setItem('usersPassword', JSON.stringify(this.passwords));
  }

  private loadUserFromStorage(): void {
    const savedUsers = localStorage.getItem('users');
    const savedPasswords = localStorage.getItem('usersPassword');

    if (savedUsers && savedPasswords) {
      this.users = JSON.parse(savedUsers);
      this.passwords = JSON.parse(savedPasswords);
    } else {
      this.users = [...this.defaultUsers];
      this.passwords = { ...this.defaultPasswords };
      this.saveUserToStorage();
    }
  }

  getToken(): string | null {
    const user = this.currentUser();
    return user ? `mock-token-${user.id}` : null;
  }

  setCurrentUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
