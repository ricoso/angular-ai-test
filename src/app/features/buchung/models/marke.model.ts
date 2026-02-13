export type Marke = 'audi' | 'bmw' | 'mercedes' | 'mini' | 'volkswagen';

export interface MarkeAnzeige {
  id: Marke;
  name: string;
}

export const VERFUEGBARE_MARKEN: MarkeAnzeige[] = [
  { id: 'audi', name: 'Audi' },
  { id: 'bmw', name: 'BMW' },
  { id: 'mercedes', name: 'Mercedes-Benz' },
  { id: 'mini', name: 'MINI' },
  { id: 'volkswagen', name: 'Volkswagen' }
];
