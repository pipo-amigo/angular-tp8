import { Component, input } from '@angular/core';
import { Cours } from '../../models/cours';

@Component({
  imports: [],
  selector: 'app-detail-cours',
  styleUrl: './detail-cours.css',
  templateUrl: './detail-cours.html',
})
export class DetailCours {
  cours = input<Cours | null>(null); // remplace @Input() cours
}
