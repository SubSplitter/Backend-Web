// src/subscription-services/dto/create-subscription-service.dto.ts
export class CreateSubscriptionServiceDto {
  name: string;
  description?: string;
  // Remove monthlyCost
  regionsAvailable?: string[];
  // Optional - Add these if you want to set them from the API
  slug?: string;
  logoUrl?: string;
  color?: string;
  category?: string;
  featuredPosition?: string;
}
