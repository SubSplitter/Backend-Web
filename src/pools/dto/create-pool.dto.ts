// src/pools/dto/create-pool.dto.ts
export class CreatePoolDto {
  userId: string;
  serviceId: string;
  name: string; // Add this line
  encryptedCredentials: string;
  slotsTotal: number;
  costPerSlot: number;
}