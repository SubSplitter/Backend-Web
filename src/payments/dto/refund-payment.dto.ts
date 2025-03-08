// src/payments/dto/refund-payment.dto.ts
import { IsUUID, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class RefundPaymentDto {
  @IsUUID()
  paymentId: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number;
}