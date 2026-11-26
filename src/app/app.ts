import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { EnTete } from './composants/en-tete/en-tete';
import { PiedPage } from './composants/pied-page/pied-page';
import { Session } from './services/session';
import { Inscriptions } from './services/inscriptions';
import { Catalogue } from './services/catalogue';

@Component({
  imports: [EnTete, PiedPage, RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  session = inject(Session);
  inscriptions = inject(Inscriptions);
  private catalogue = inject(Catalogue);
  private router = inject(Router);

  ngOnInit() {
    // Les cours sont chargés une seule fois, au démarrage de l'application
    this.catalogue.charger();
  }

  deconnecter() {
    this.session.deconnecter();
    this.router.navigateByUrl('/');
  }
}
