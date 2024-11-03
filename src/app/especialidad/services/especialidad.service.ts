import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { especialidad } from '../models/especialidad';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private apiUrl = 'http://localhost:8080/api/especialidad';

  constructor(private http: HttpClient) { }

  getEspecialidades(): Observable<especialidad[]> {
    return this.http.get<especialidad[]>(this.apiUrl);
  }

  getEspecialidadById(id: number): Observable<especialidad> {
    return this.http.get<especialidad>(`${this.apiUrl}/${id}`);
  }
  updateEspecialidad(especialidad: especialidad, id:number): Observable<especialidad> {
    return this.http.put<especialidad>(this.apiUrl, especialidad);
  }
  deleteEspecialidad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  createEspecialidad(especialidad: especialidad): Observable<especialidad> {
    return this.http.post<especialidad>(this.apiUrl, especialidad);
  }
}
