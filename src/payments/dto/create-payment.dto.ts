// src/payments/dto/create-payment.dto.ts
import { IsUUID, IsNumber, IsPositive } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  poolMemberId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}

