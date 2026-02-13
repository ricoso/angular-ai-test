/**
 * Vehicle brand type union
 * BR-1: Exactly 5 brands available
 */
export type Marke = 'audi' | 'bmw' | 'mercedes' | 'mini' | 'volkswagen';

/**
 * Brand display model with id and display name
 */
export interface MarkeAnzeige {
  id: Marke;
  name: string;
}

/**
 * Static brand data (Click-Dummy)
 * Order matches mockup layout
 */
export const VERFUEGBARE_MARKEN: MarkeAnzeige[] = [
  { id: 'audi', name: 'Audi' },
  { id: 'bmw', name: 'BMW' },
  { id: 'mercedes', name: 'Mercedes-Benz' },
  { id: 'mini', name: 'MINI' },
  { id: 'volkswagen', name: 'Volkswagen' }
];
