// src/pools/dto/update-pool.dto.ts
export class UpdatePoolDto {
  name?: string; // Add this line
  encryptedCredentials?: string;
  slotsTotal?: number;
  slotsAvailable?: number;
  costPerSlot?: number;
  isActive?: boolean;
}