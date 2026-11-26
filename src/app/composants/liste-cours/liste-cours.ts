import { Component, computed, inject, output, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Cours } from '../../models/cours';
import { Catalogue } from '../../services/catalogue';

@Component({
  imports: [RouterLink, FormsModule, UpperCasePipe],
  selector: 'app-liste-cours',
  styleUrl: './liste-cours.css',
  templateUrl: './liste-cours.html',
})
export class ListeCours {
  catalogue = inject(Catalogue);

  coursSelectionne = output<Cours>(); // remplace @Output + EventEmitter
  coursActif = signal<Cours | null>(null);

  recherche = signal('');
  categorie = signal(''); // chaîne vide = toutes
  tri = signal<'asc' | 'desc'>('asc');

  // La liste affichée est déduite de 4 sources : cours, recherche, catégorie, tri
  coursAffiches = computed(() => {
    const q = this.recherche().trim().toLowerCase();
    const cat = this.categorie();
    const liste = this.catalogue
      .cours()
      .filter((c) => c.titre.toLowerCase().includes(q))
      .filter((c) => !cat || c.categorie === cat)
      .sort((a, b) => a.titre.localeCompare(b.titre));
    return this.tri() === 'desc' ? liste.reverse() : liste;
  });

  selectionner(c: Cours) {
    this.coursActif.set(c);
    this.coursSelectionne.emit(c);
  }
}
