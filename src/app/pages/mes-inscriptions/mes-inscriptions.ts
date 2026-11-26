import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Session } from '../../services/session';
import { Catalogue } from '../../services/catalogue';
import { Inscriptions } from '../../services/inscriptions';

@Component({
  selector: 'app-mes-inscriptions',
  imports: [DatePipe, RouterLink],
  templateUrl: './mes-inscriptions.html',
  styleUrl: './mes-inscriptions.css',
})
export class MesInscriptions {
  session = inject(Session);
  private catalogue = inject(Catalogue);
  inscriptions = inject(Inscriptions);

  erreur = signal('');
  niveaux = [
    { valeur: 'debutant', libelle: 'Débutant' },
    { valeur: 'intermediaire', libelle: 'Intermédiaire' },
    { valeur: 'avance', libelle: 'Avancé' },
  ];

  // Chaîne de computed : details dépend des inscriptions et des cours, totalHeures dépend de details
  details = computed(() =>
    this.inscriptions.liste().map((i) => ({ ...i, cours: this.catalogue.trouver(i.coursId) })),
  );

  totalHeures = computed(() =>
    this.details().reduce((somme, d) => somme + (parseInt(d.cours?.duree ?? '0', 10) || 0), 0),
  );

  annuler(id: number) {
    this.inscriptions.annuler(id).subscribe({
      error: () => this.erreur.set("L'annulation a échoué."),
    });
  }

  changerNiveau(id: number, niveau: string) {
    this.inscriptions.modifierNiveau(id, niveau).subscribe({
      error: () => this.erreur.set('La modification a échoué.'),
    });
  }
}
