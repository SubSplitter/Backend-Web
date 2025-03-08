import { Module } from '@nestjs/common';
import { UserSubscriptionsService } from './user-subscription.service';
import { UserSubscriptionsController } from './user-subscription.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [UserSubscriptionsController],
  providers: [UserSubscriptionsService],
  exports: [UserSubscriptionsService],
})
export class UserSubscriptionsModule {}
