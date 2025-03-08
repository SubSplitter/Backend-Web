// src/subscription-services/dto/update-subscription-service.dto.ts
export class UpdateSubscriptionServiceDto {
    name?: string;
    description?: string;
    monthlyCost?: number;
    regionsAvailable?: string[];
  }