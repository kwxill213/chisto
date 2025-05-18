// utils/pricing.ts
export const calculatePrice = (
  serviceType: ServiceType,
  propertyType: PropertyType,
  square: number,
  rooms?: number,
): number => {
  const baseRates = {
    APARTMENT: {
      GENERAL: 80, // ₽/м²
      REGULAR: 50,
      AFTER_REPAIR: 120,
      WINDOWS: 300, // за окно
    },
    OFFICE: {
      GENERAL: 100,
      REGULAR: 70,
      AFTER_REPAIR: 150,
      WINDOWS: 500,
    },
  };

  if (serviceType === 'WINDOWS') {
    return (rooms || 1) * baseRates[propertyType][serviceType];
  }
  return square * baseRates[propertyType][serviceType];
};