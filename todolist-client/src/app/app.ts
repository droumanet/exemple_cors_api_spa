import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tache, TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  nomUtilisateur = '';
  taches: Tache[] = [];

  nouvelleTache: Tache = {
    descTache: '',
    prioTache: 1,
    doneTache: false,
    proprioTache: ''
  };

  constructor(private todoService: TodoService, private cdr: ChangeDetectorRef) {}

  chargerTaches() {
    if (!this.nomUtilisateur) {console.log("nom manquant"); return};
    this.todoService.getTaches(this.nomUtilisateur).subscribe({
      next: (data) => { this.taches = data
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur chargement (probablement CORS) :', err)
    });
  }

  ajouter() {
    if (!this.nomUtilisateur) {
      alert('Veuillez renseigner votre nom.');
      return;
    }
    this.nouvelleTache.proprioTache = this.nomUtilisateur;
    this.todoService.ajouterTache(this.nouvelleTache).subscribe({
      next: (cree) => {
        this.nouvelleTache = { descTache: '', prioTache: 1, doneTache: false, proprioTache: '' };
        this.chargerTaches();
      },
      error: (err) => console.error('Erreur ajout (probablement CORS) :', err)
    });
  }

  toggle(tache: Tache) {
    this.todoService.toggleDone(tache).subscribe(() => this.chargerTaches());
  }

  supprimer(id: number) {
    this.todoService.supprimerTache(id!).subscribe(() => this.chargerTaches());
  }
}
