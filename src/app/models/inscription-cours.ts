export interface InscriptionCours {
  id: number; // attribué par l'API à la création
  utilisateur: string; // nom de l'utilisateur connecté
  coursId: number;
  nom: string;
  email: string;
  niveau: string;
  date: string; // date ISO (ex. 2026-11-20T09:30:00.000Z)
}

// Ce que le formulaire fournit : l'API et le service complètent le reste
export type NouvelleInscription = Omit<InscriptionCours, 'id' | 'utilisateur'>;
