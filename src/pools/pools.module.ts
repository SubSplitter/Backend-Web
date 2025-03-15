import { Module } from '@nestjs/common';
import { PoolsService } from './pools.service';
import { PoolsController } from './pools.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { KindeAuthGuard } from 'src/auth/kinde.guard';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [DrizzleModule,AuthModule,UserModule],
  controllers: [PoolsController],
  providers: [PoolsService,KindeAuthGuard],
  exports: [PoolsService],
})
export class PoolsModule {}
