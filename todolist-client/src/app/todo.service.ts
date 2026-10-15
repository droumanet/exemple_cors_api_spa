import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tache {
  idTache?: number;
  descTache: string;
  prioTache: number;
  doneTache: boolean;
  proprioTache: string;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private apiUrl = 'http://localhost:4000/taches';

  constructor(private http: HttpClient) {}

  getTaches(proprio: string): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.apiUrl}?proprio=${proprio}`);
  }

  ajouterTache(tache: Tache): Observable<Tache> {
    return this.http.post<Tache>(this.apiUrl, tache);
  }

  supprimerTache(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleDone(tache: Tache): Observable<Tache> {
    return this.http.put<Tache>(`${this.apiUrl}/${tache.idTache}`, { doneTache: !tache.doneTache });
  }
}