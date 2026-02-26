import type { CustomerInfo, Salutation, VehicleInfo } from './customer.model';

describe('Customer Models', () => {
  describe('Salutation', () => {
    it('should accept "mr" as valid salutation', () => {
      const salutation: Salutation = 'mr';
      expect(salutation).toBe('mr');
    });

    it('should accept "ms" as valid salutation', () => {
      const salutation: Salutation = 'ms';
      expect(salutation).toBe('ms');
    });
  });

  describe('CustomerInfo', () => {
    it('should create a valid CustomerInfo object', () => {
      const customer: CustomerInfo = {
        email: 'max@mustermann.de',
        salutation: 'mr',
        firstName: 'Max',
        lastName: 'Mustermann',
        street: 'Musterweg 1',
        postalCode: '30159',
        city: 'Berlin',
        mobilePhone: '017012345678'
      };

      expect(customer.email).toBe('max@mustermann.de');
      expect(customer.salutation).toBe('mr');
      expect(customer.firstName).toBe('Max');
      expect(customer.lastName).toBe('Mustermann');
      expect(customer.street).toBe('Musterweg 1');
      expect(customer.postalCode).toBe('30159');
      expect(customer.city).toBe('Berlin');
      expect(customer.mobilePhone).toBe('017012345678');
    });
  });

  describe('VehicleInfo', () => {
    it('should create a valid VehicleInfo object', () => {
      const vehicle: VehicleInfo = {
        licensePlate: 'B-MS1234',
        mileage: 50000,
        vin: 'WDB8XXXXXXA123456'
      };

      expect(vehicle.licensePlate).toBe('B-MS1234');
      expect(vehicle.mileage).toBe(50000);
      expect(vehicle.vin).toBe('WDB8XXXXXXA123456');
    });

    it('should enforce mileage as number type', () => {
      const vehicle: VehicleInfo = {
        licensePlate: 'M-AB999',
        mileage: 0,
        vin: 'WBAPH5C55BA123456'
      };

      expect(typeof vehicle.mileage).toBe('number');
    });
  });
});
