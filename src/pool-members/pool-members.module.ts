// // src/pool-members/pool-members.module.ts
import { Module } from '@nestjs/common';
import { PoolMembersService } from './pool-members.service';
import { PoolMembersController } from './pool-members.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { PoolsModule } from '../pools/pools.module';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [DrizzleModule, PoolsModule, UserModule],
  controllers: [PoolMembersController],
  providers: [PoolMembersService],
  exports: [PoolMembersService],
})
export class PoolMembersModule {}
