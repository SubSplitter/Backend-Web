// src/pool-members/dto/update-pool-member.dto.ts
export class UpdatePoolMemberDto {
  paymentStatus?: 'unpaid' | 'processing' | 'paid' | 'failed';
  accessStatus?: 'pending' | 'granted' | 'revoked';
  lastPaymentDate?: Date;
}