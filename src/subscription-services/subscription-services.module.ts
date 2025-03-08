// // src/subscription-services/subscription-services.module.ts
import { Module } from '@nestjs/common';
import { SubscriptionServicesService } from './subscription-services.service';
import { SubscriptionServicesController } from './subscription-services.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [SubscriptionServicesController],
  providers: [SubscriptionServicesService],
  exports: [SubscriptionServicesService],
})
export class SubscriptionServicesModule {}