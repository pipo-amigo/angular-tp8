import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Session } from '../../services/session';
import { Catalogue } from '../../services/catalogue';
import { Inscriptions } from '../../services/inscriptions';
import { nomComplet } from '../../validators/nom-complet';

@Component({
  selector: 'app-inscription',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription implements OnInit {
  private session = inject(Session);
  catalogue = inject(Catalogue);
  inscriptions = inject(Inscriptions);

  id = input.required<string>(); // reçoit le :id de l'URL
  cours = computed(() => this.catalogue.trouver(Number(this.id())));

  // confirmation, envoiEnCours et erreur restent des signals (TP7)
  confirmation = signal('');
  envoiEnCours = signal(false);
  erreur = signal('');

  form = new FormGroup({
    nom: new FormControl('', [Validators.required, nomComplet]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telephone: new FormControl('', [Validators.pattern(/^[0-9]{8}$/)]),
    niveau: new FormControl('', [Validators.required]),
    motivation: new FormControl('', [Validators.required, Validators.minLength(20)]),
    conditions: new FormControl(false, [Validators.requiredTrue]),
  });

  ngOnInit() {
    // Pré-remplit le nom avec celui de l'utilisateur connecté
    this.form.patchValue({ nom: this.session.nom() });
  }

  envoyer() {
    const cours = this.cours();
    if (this.form.invalid || !cours) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.envoiEnCours.set(true);
    this.erreur.set('');

    this.inscriptions
      .ajouter({
        coursId: cours.id,
        nom: v.nom ?? '',
        email: v.email ?? '',
        niveau: v.niveau ?? '',
        date: new Date().toISOString(),
      })
      .subscribe({
        next: () => {
          this.confirmation.set(`Merci ${v.nom} ! Votre inscription à « ${cours.titre} » est enregistrée.`);
          this.form.reset();
          this.envoiEnCours.set(false);
        },
        error: () => {
          this.erreur.set("L'inscription a échoué. Réessayez dans un instant.");
          this.envoiEnCours.set(false);
        },
      });
  }

  get nom() { return this.form.controls.nom; }
  get email() { return this.form.controls.email; }
  get telephone() { return this.form.controls.telephone; }
  get niveau() { return this.form.controls.niveau; }
  get motivation() { return this.form.controls.motivation; }
  get conditions() { return this.form.controls.conditions; }
}
