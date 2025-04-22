import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';




interface ApiResponse<T> {
  data: T;
  message?: string;
  code?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Event emitter to broadcast authentication state changes
  authStateChanged = new EventEmitter<boolean>();
  private baseUrl = environment.apiBaseUrl; // Base URL from environment
  
  constructor(private http: HttpClient) {}
  
  // HTTP headers with authorization
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
  
  // Authentication methods

  
  
  logout(): void {
    localStorage.removeItem('token');
    this.authStateChanged.emit(false);
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  
  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, { email });
  }
  
  confirmPasswordReset(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirm-reset-password`, { token, newPassword });
  }
  
  // Generic HTTP methods with Promise support
  // GET all items
  getAll<T>(endpoint: string): Promise<T[]> {
    return this.http.get<ApiResponse<T[]>>(`${this.baseUrl}/${endpoint}`, { headers: this.getHeaders() })
      .toPromise()
      .then((response: any) => response);
  }
  
  // GET item by ID
  getById<T>(endpoint: string, id: string | number): Promise<T> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`, { headers: this.getHeaders() })
      .toPromise()
      .then((response: any) => response);
  }
  
  // POST new item
  post<T>(endpoint: string, data: any): Promise<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data, { headers: this.getHeaders() })
      .toPromise()
      .then((response: any) => response);
  }
  
  // PUT update item
  // put<T>(endpoint: string, id: string | number, data: any): Promise<T> {
  //   return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`, data, { headers: this.getHeaders() })
  //     .toPromise()
  //     .then((response: any) => response);
  // }
  put<T>(endpoint: string, data: any): Promise<T> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data, { headers: this.getHeaders() })
      .toPromise()
      .then((response: any) => response);
  }
  
  
  // PATCH partial update
  patch<T>(endpoint: string, id: string | number, data: any): Promise<T> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`, data, { headers: this.getHeaders() })
      .toPromise()
      .then((response: any) => response);
  }
  
  // DELETE item
  delete<T>(endpoint: string, id: string | number): Promise<T> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`, { headers: this.getHeaders() })
      .toPromise()
      .then((response: any) => response);
  }
  
  // Search or filter items
  getWithPagination<T>(endpoint: string, queryParams: any): Promise<T[]> {
    const params = new URLSearchParams();
    
    // Add query parameters
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== null && queryParams[key] !== undefined) {
        params.append(key, queryParams[key]);
      }
    });
    
    return this.http.get<ApiResponse<T[]>>(`${this.baseUrl}/${endpoint}?${params.toString()}`, 
      { headers: this.getHeaders() })
      .toPromise()
      .then((response: any) => response);
  }
}