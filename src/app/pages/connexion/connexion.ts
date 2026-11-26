import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Session } from '../../services/session';

@Component({
  selector: 'app-connexion',
  imports: [FormsModule],
  templateUrl: './connexion.html',
})
export class Connexion {
  private session = inject(Session);
  private router = inject(Router);

  retour = input(''); // reçoit ?retour=... de l'URL
  nom = signal('');

  seConnecter() {
    this.session.connecter(this.nom());
    this.router.navigateByUrl(this.retour() || '/mes-inscriptions');
  }
}
