import { Module } from '@nestjs/common';
import { UserSubscriptionsService } from './pools.service';
import { UserSubscriptionsController } from './pools.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { KindeAuthGuard } from 'src/auth/kinde.guard';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [DrizzleModule,AuthModule,UserModule],
  controllers: [UserSubscriptionsController],
  providers: [UserSubscriptionsService,KindeAuthGuard],
  exports: [UserSubscriptionsService],
})
export class UserSubscriptionsModule {}
