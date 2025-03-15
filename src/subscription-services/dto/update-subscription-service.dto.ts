// src/subscription-services/dto/update-subscription-service.dto.ts
export class UpdateSubscriptionServiceDto {
  name?: string;
  description?: string;
  // Remove monthlyCost
  regionsAvailable?: string[];
  // Optional - Add these if you want to update them from the API
  slug?: string;
  logoUrl?: string;
  color?: string;
  category?: string;
  featuredPosition?: string;
}
