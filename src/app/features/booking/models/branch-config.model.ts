export interface BranchAddress {
  street: string;
  zip: string;
  city: string;
}

export interface BranchConfig {
  branchId: string;
  name: string;
  address: BranchAddress;
  brands: string[];
}

export interface BranchConfigFile {
  branches: BranchConfig[];
  defaultBranchId: string;
}

/** Map brand display name to SVG filename in assets/brands/ */
/* eslint-disable @typescript-eslint/naming-convention */
export const BRAND_LOGO_MAP: Record<string, string> = {
  'VW': 'volkswagen.svg',
  'Volkswagen': 'volkswagen.svg',
  'VW Nutzfahrzeuge': 'vw_nutzfahrzeuge.svg',
  'Audi': 'audi.svg',
  'SEAT': 'seat.svg',
  'CUPRA': 'cupra.svg',
  'ŠKODA': 'skoda.svg',
  'Hyundai': 'hyundai.svg',
  'Porsche': 'porsche.svg',
  'Bentley': 'bentley.svg',
  'Bugatti': 'bugatti.svg',
  'Rimac': 'rimac.svg',
};
/* eslint-enable @typescript-eslint/naming-convention */
