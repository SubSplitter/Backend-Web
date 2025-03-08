// src/subscription-services/dto/create-subscription-service.dto.ts
export class CreateSubscriptionServiceDto {
    name: string;
    description?: string;
    monthlyCost: number;
    regionsAvailable?: string[];
  }