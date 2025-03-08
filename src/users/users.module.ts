import { Module } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UserController } from 'src/users/users.controller';

@Module({
  imports: [DrizzleModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
