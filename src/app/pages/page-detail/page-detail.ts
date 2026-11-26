import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DetailCours } from '../../composants/detail-cours/detail-cours';
import { Catalogue } from '../../services/catalogue';

@Component({
  selector: 'app-page-detail',
  imports: [DetailCours, RouterLink],
  templateUrl: './page-detail.html',
})
export class PageDetail {
  catalogue = inject(Catalogue);

  id = input.required<string>(); // reçoit le :id de l'URL
  cours = computed(() => this.catalogue.trouver(Number(this.id())));
}
