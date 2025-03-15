// src/user-subscriptions/dto/create-user-subscription.dto.ts
export class CreateUserSubscriptionDto {
  userId: string;
  serviceId: string;
  encryptedCredentials?: string;
  slotsTotal: number;
  costPerSlot: number;
}
