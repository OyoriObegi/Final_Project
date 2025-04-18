import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StorageService } from './storage.service';

export interface User {
  id: string;
  email: string;
  role: 'jobseeker' | 'employer' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'user_data';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private storageService: StorageService) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const user = this.storageService.getItem<User>(this.userKey);
    this.isAuthenticatedSubject.next(!!user);
    this.currentUserSubject.next(user);
  }

  login(credentials: { email: string; password: string }): Observable<{ success: boolean }> {
    // Mock login - always succeeds for testing
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      role: credentials.email.includes('employer') ? 'employer' : 'jobseeker'
    };

    this.storageService.setItem<User>(this.userKey, mockUser);
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(mockUser);

    return of({ success: true });
  }

  register(userData: { email: string; password: string; role: 'jobseeker' | 'employer' }): Observable<{ success: boolean }> {
    // Mock registration - always succeeds for testing
    return of({ success: true });
  }

  logout(): void {
    this.storageService.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getUserId(): string | null {
    const user = this.storageService.getItem<User>(this.userKey);
    return user?.id || null;
  }

  getUserRole(): string | null {
    const user = this.currentUserSubject.getValue();
    return user?.role || null;
  }

  isJobSeeker(): boolean {
    const user = this.currentUserSubject.getValue();
    return user?.role === 'jobseeker';
  }

  isEmployer(): boolean {
    const user = this.currentUserSubject.getValue();
    return user?.role === 'employer';
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.getValue();
    return user?.role === 'admin';
  }
} 