import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Cours } from '../models/cours';

@Injectable({ providedIn: 'root' })
export class Catalogue {
  private http = inject(HttpClient);

  private _cours = signal<Cours[]>([]);
  private _chargement = signal(true);
  private _erreur = signal('');

  readonly cours = this._cours.asReadonly();
  readonly chargement = this._chargement.asReadonly();
  readonly erreur = this._erreur.asReadonly();

  // Valeur dérivée : les catégories présentes, sans doublon
  readonly categories = computed(() => [...new Set(this._cours().map((c) => c.categorie))].sort());

  charger() {
    this._chargement.set(true);
    this._erreur.set('');
    this.http.get<Cours[]>('/cours').subscribe({
      next: (liste) => {
        this._cours.set(liste);
        this._chargement.set(false);
      },
      error: () => {
        this._erreur.set("Impossible de charger les cours. L'API est-elle démarrée ?");
        this._chargement.set(false);
      },
    });
  }

  trouver(id: number): Cours | undefined {
    return this._cours().find((c) => c.id === id);
  }
}
