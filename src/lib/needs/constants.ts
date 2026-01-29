export const CITIES = [
  "Agadir",
  "Casablanca",
  "Marrakech",
  "Rabat",
  "Tanger",
  "Fès",
  "Meknès",
  "Oujda",
  "Tétouan",
  "Laâyoune",
  "Dakhla",
] as const;

export const CATEGORIES = [
  "Nettoyage",
  "Soutien scolaire",
  "Don urgent",
  "Aide communautaire",
  "Autre",
] as const;

export type City = (typeof CITIES)[number];
export type Category = (typeof CATEGORIES)[number];


