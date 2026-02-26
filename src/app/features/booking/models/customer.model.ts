/** Salutation type */
export type Salutation = 'mr' | 'ms';

/** Customer contact data */
export interface CustomerInfo {
  email: string;
  salutation: Salutation;
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  mobilePhone: string;
}

/** Vehicle identification data */
export interface VehicleInfo {
  licensePlate: string;
  mileage: number;
  vin: string;
}
