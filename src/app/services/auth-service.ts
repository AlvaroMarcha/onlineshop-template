import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAdminSubject = new BehaviorSubject<boolean>(this.loadAdminState());
  isAdmin$ = this.isAdminSubject.asObservable(); // observable para suscriptores

  private loadAdminState(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  setAdmin(value: boolean) {
    this.isAdminSubject.next(value); // actualiza el valor y notifica
    localStorage.setItem('isAdmin', String(value));
  }

  isAdmin(): boolean {
    return this.isAdminSubject.value;
  }

  logout() {
    this.isAdminSubject.next(false);
    localStorage.removeItem('isAdmin');
  }
}
