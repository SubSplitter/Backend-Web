// src/user-subscriptions/dto/update-user-subscription.dto.ts
export class UpdateUserSubscriptionDto {
    encryptedCredentials?: string;
    slotsTotal?: number;
    slotsAvailable?: number;
    costPerSlot?: number;
    isActive?: boolean;
  }