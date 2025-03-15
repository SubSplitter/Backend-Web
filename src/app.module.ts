import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import databaseConfig from './config/database.config';
import { UserModule } from './users/users.module';
import configuration from './config/configuration';
import { PoolsModule } from './pools/pools.module';
import { SubscriptionServicesModule } from './subscription-services/subscription-services.module';
import { PaymentsModule } from './payments/payments.module';
import { PoolMembersModule } from './pool-members/pool-members.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, configuration],
    }),
    DrizzleModule,
    UserModule,
    SubscriptionServicesModule,
    PoolsModule,
    PaymentsModule,
    PoolMembersModule,
    
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
