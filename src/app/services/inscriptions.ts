import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { InscriptionCours, NouvelleInscription } from '../models/inscription-cours';
import { Session } from './session';

@Injectable({ providedIn: 'root' })
export class Inscriptions {
  private http = inject(HttpClient);
  private session = inject(Session);

  // Copie locale, synchronisée avec l'API
  private _liste = signal<InscriptionCours[]>([]);
  readonly liste = this._liste.asReadonly();

  private _erreur = signal('');
  readonly erreur = this._erreur.asReadonly();

  // Valeurs dérivées
  readonly nombre = computed(() => this._liste().length);
  private idsCours = computed(() => new Set(this._liste().map((i) => i.coursId)));

  constructor() {
    // Chaque fois que la session change, on resynchronise les inscriptions
    effect(() => {
      if (this.session.connecte()) {
        this.charger().subscribe({
          error: () => this._erreur.set('Impossible de charger vos inscriptions.'),
        });
      } else {
        this._liste.set([]);
      }
    });
  }

  // READ : les inscriptions de l'utilisateur connecté
  charger(): Observable<InscriptionCours[]> {
    return this.http
      .get<InscriptionCours[]>('/inscriptions', { params: { utilisateur: this.session.nom() } })
      .pipe(
        tap((liste) => {
          this._liste.set(liste);
          this._erreur.set('');
        }),
      );
  }

  // CREATE
  ajouter(donnees: NouvelleInscription): Observable<InscriptionCours> {
    const nouvelle = { ...donnees, utilisateur: this.session.nom() };
    return this.http
      .post<InscriptionCours>('/inscriptions', nouvelle)
      .pipe(tap((creee) => this._liste.update((l) => [...l, creee])));
  }

  // UPDATE
  modifierNiveau(id: number, niveau: string): Observable<InscriptionCours> {
    return this.http
      .patch<InscriptionCours>(`/inscriptions/${id}`, { niveau })
      .pipe(tap((maj) => this._liste.update((l) => l.map((i) => (i.id === id ? maj : i)))));
  }

  // DELETE
  annuler(id: number): Observable<unknown> {
    return this.http
      .delete(`/inscriptions/${id}`)
      .pipe(tap(() => this._liste.update((l) => l.filter((i) => i.id !== id))));
  }

  estInscrit(coursId: number): boolean {
    return this.idsCours().has(coursId);
  }
}
