import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private checkBrowser(): boolean {
    return this.isBrowser && typeof window !== 'undefined' && window.localStorage !== undefined;
  }

  getItem<T>(key: string): T | null {
    if (this.checkBrowser()) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        return null;
      }
    }
    return null;
  }

  setItem<T>(key: string, value: T): void {
    if (this.checkBrowser()) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error setting localStorage item:', error);
      }
    }
  }

  removeItem(key: string): void {
    if (this.checkBrowser()) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing localStorage item:', error);
      }
    }
  }

  clear(): void {
    if (this.checkBrowser()) {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  }

  getUser(): any {
    if (!this.checkBrowser()) return null;
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  setUser(user: any): void {
    if (!this.checkBrowser()) return;
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  }

  removeUser(): void {
    if (!this.checkBrowser()) return;
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  }
} 