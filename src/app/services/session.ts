import { Injectable, effect, signal } from '@angular/core';

const CLE = 'session-catalogue';

@Injectable({ providedIn: 'root' })
export class Session {
  connecte = signal(false);
  nom = signal('');

  constructor() {
    this.restaurer();

    // Sauvegarde automatique à chaque changement de la session
    effect(() => {
      const etat = { connecte: this.connecte(), nom: this.nom() };
      try {
        localStorage.setItem(CLE, JSON.stringify(etat));
      } catch {
        /* stockage indisponible : on ignore */
      }
    });
  }

  private restaurer() {
    try {
      const brut = localStorage.getItem(CLE);
      if (brut) {
        const etat = JSON.parse(brut);
        this.nom.set(etat.nom ?? '');
        this.connecte.set(!!etat.connecte);
      }
    } catch {
      /* données illisibles : on ignore */
    }
  }

  connecter(nom: string) {
    this.nom.set(nom);
    this.connecte.set(true);
  }

  deconnecter() {
    this.nom.set('');
    this.connecte.set(false);
  }
}
