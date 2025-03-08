// src/payments/payments.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards, Query, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';

@Controller('payments')
// @UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto, @Req() req) {
    return this.paymentsService.createPayment(
      createPaymentDto.poolMemberId,
      createPaymentDto.amount,
    );
  }

  @Get('webhook/dodo')
  async handleDodoWebhook(@Body() webhookData: any) {
    // In production, validate webhook signature
    if (webhookData.type === 'payment.succeeded') {
      return this.paymentsService.confirmPayment(webhookData.data.id);
    }
    return { received: true };
  }

  @Get(':poolMemberId/history')
  async getPaymentHistory(@Param('poolMemberId') poolMemberId: string) {
    return this.paymentsService.getPaymentHistory(poolMemberId);
  }

  @Post('confirm')
  async confirmPayment(@Body() body: { paymentId: string }) {
    return this.paymentsService.confirmPayment(body.paymentId);
  }

  @Post('refund')
  async refundPayment(@Body() refundPaymentDto: RefundPaymentDto) {
    return this.paymentsService.refundPayment(refundPaymentDto.paymentId, refundPaymentDto.amount);
  }
}
