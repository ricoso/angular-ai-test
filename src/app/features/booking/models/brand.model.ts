/**
 * Vehicle brand type union
 * BR-1: Exactly 5 brands available
 */
export type Brand = 'audi' | 'bmw' | 'mercedes' | 'mini' | 'volkswagen';

/**
 * Brand display model with id and display name
 */
export interface BrandDisplay {
  id: Brand;
  name: string;
}

/**
 * Static brand data (Click-Dummy)
 * Order matches mockup layout
 */
export const AVAILABLE_BRANDS: BrandDisplay[] = [
  { id: 'audi', name: 'Audi' },
  { id: 'bmw', name: 'BMW' },
  { id: 'mercedes', name: 'Mercedes-Benz' },
  { id: 'mini', name: 'MINI' },
  { id: 'volkswagen', name: 'Volkswagen' }
];
