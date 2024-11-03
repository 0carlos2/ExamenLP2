import { Injectable } from '@angular/core';
import { doctor } from '../models/doctor';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = 'http://localhost:8080/api/doctor';

  constructor(private http: HttpClient) { }

  getDoctores(): Observable<doctor[]> {
    return this.http.get<doctor[]>(this.apiUrl);
  }

  getDoctorById(id: number): Observable<doctor> {
    return this.http.get<doctor>(`${this.apiUrl}/${id}`);
  }

  updateDoctor(doctor: doctor, id:number): Observable<doctor> {
    return this.http.put<doctor>(`${this.apiUrl}/${id}`, doctor);
  }

  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  } 
  createDoctor(doctor: doctor): Observable<doctor> {
    return this.http.post<doctor>(this.apiUrl, doctor);
  } 
}

