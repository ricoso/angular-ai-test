export type Salutation = 'mr' | 'ms';

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

export interface VehicleInfo {
  licensePlate: string;
  mileage: number;
}
