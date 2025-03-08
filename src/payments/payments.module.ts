// src/payments/payments.module.ts
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { PoolMembersModule } from '../pool-members/pool-members.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    DrizzleModule, 
    PoolMembersModule,
    HttpModule
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}