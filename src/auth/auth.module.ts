import { Module } from '@nestjs/common';
import { KindeAuthGuard } from 'src/auth/kinde.guard';
import { UserService } from 'src/users/users.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UserModule } from 'src/users/users.module';
import { UserSubscriptionsService } from 'src/pools/pools.service';
import { UserSubscriptionsModule } from 'src/pools/pools.module';

@Module({
  imports: [
    // Import DrizzleModule to ensure UserService has access to the database
    DrizzleModule,
    UserModule,
    //UserSubscriptionsModule
  ],
  providers: [
    KindeAuthGuard,
    UserService,
    UserSubscriptionsService
  ],
  exports: [
    KindeAuthGuard,
  ],
})
export class AuthModule {}