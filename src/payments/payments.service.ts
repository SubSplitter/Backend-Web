// src/payments/payments.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DrizzleService } from '../drizzle/drizzle.service';
import { payments } from './schema/payments.schema';
import { PoolMembersService } from '../pool-members/pool-members.service';
import { firstValueFrom } from 'rxjs';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly dodoApiUrl: string;
  private readonly dodoApiKey: string;

  constructor(
    private readonly drizzle: DrizzleService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly poolMembersService: PoolMembersService,
  ) {
    // Fix for undefined value errors
    this.dodoApiUrl = this.configService.get<string>('DODO_API_URL') || 'https://api.dodo.com/v1';
    this.dodoApiKey = this.configService.get<string>('DODO_API_KEY') || '';
  }

  async createPayment(poolMemberId: string, amount: number) {
    // Get pool member details to verify payment
    const poolMember = await this.poolMembersService.findOne(poolMemberId);

    if (!poolMember) {
      throw new BadRequestException('Pool member not found');
    }

    try {
      // Create payment in Dodo
      const paymentData = {
        amount: amount,
        currency: 'USD',
        description: `Subscription payment for pool member ${poolMemberId}`,
        metadata: {
          poolMemberId,
          userSubscriptionId: poolMember.userSubscriptionId,
        },
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.dodoApiUrl}/payments`, paymentData, {
          headers: {
            Authorization: `Bearer ${this.dodoApiKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      const dodoPayment = response.data;

      // Record payment in our database - Fix amount type
      const [newPayment] = await this.drizzle.db
        .insert(payments)
        .values({
          poolMemberId,
          amount: amount.toString(), // Convert number to string for drizzle
          escrowStatus: 'pending',
          paymentDate: new Date(),
        })
        .returning();

      // Update pool member payment status - Fix enum value
      await this.poolMembersService.updatePaymentStatus(poolMemberId, 'processing');

      return {
        paymentId: newPayment.paymentId,
        dodoPaymentId: dodoPayment.id,
        checkoutUrl: dodoPayment.checkout_url,
      };
    } catch (error) {
      this.logger.error(`Failed to create payment: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create payment');
    }
  }

  async confirmPayment(dodoPaymentId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.dodoApiUrl}/payments/${dodoPaymentId}`, {
          headers: {
            Authorization: `Bearer ${this.dodoApiKey}`,
          },
        }),
      );

      const dodoPayment = response.data;
      const { poolMemberId } = dodoPayment.metadata;

      if (dodoPayment.status === 'succeeded') {
        // Find payment record - Fix orderBy parameter
        const [payment] = await this.drizzle.db
          .select()
          .from(payments)
          .where(eq(payments.poolMemberId, poolMemberId))
          .orderBy(desc(payments.paymentDate)) // Use desc() from drizzle-orm
          .limit(1);

        if (!payment) {
          throw new BadRequestException('Payment record not found');
        }

        // Update payment status
        await this.drizzle.db
          .update(payments)
          .set({
            escrowStatus: 'completed',
            releaseDate: new Date(),
          })
          .where(eq(payments.paymentId, payment.paymentId));

        // Update pool member status - Fix enum values
        await this.poolMembersService.updatePaymentStatus(poolMemberId, 'paid');
        await this.poolMembersService.updateAccessStatus(poolMemberId, 'granted'); // Change to 'granted' instead of 'active'

        return { status: 'success', message: 'Payment confirmed' };
      } else {
        return { status: 'pending', message: 'Payment is still processing' };
      }
    } catch (error) {
      this.logger.error(`Failed to confirm payment: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to confirm payment');
    }
  }

  async getPaymentHistory(poolMemberId: string) {
    // Fix orderBy parameter
    return this.drizzle.db
      .select()
      .from(payments)
      .where(eq(payments.poolMemberId, poolMemberId))
      .orderBy(desc(payments.paymentDate)); // Use desc() from drizzle-orm
  }

  async refundPayment(paymentId: string, amount?: number) {
    const [payment] = await this.drizzle.db
      .select()
      .from(payments)
      .where(eq(payments.paymentId, paymentId));

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    // Parse amount from string back to number (if needed)
    const paymentAmount = typeof payment.amount === 'string' 
      ? parseFloat(payment.amount) 
      : payment.amount;
      
    const refundAmount = amount || paymentAmount;

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.dodoApiUrl}/refunds`,
          {
            payment: payment.paymentId,
            amount: refundAmount,
            reason: 'requested_by_customer',
          },
          {
            headers: {
              Authorization: `Bearer ${this.dodoApiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      // Update payment status
      await this.drizzle.db
        .update(payments)
        .set({
          escrowStatus: 'refunded',
        })
        .where(eq(payments.paymentId, paymentId));

      return {
        status: 'success',
        refundId: response.data.id,
        amount: refundAmount,
      };
    } catch (error) {
      this.logger.error(`Failed to refund payment: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to refund payment');
    }
  }
}