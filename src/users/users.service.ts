import { Injectable } from '@nestjs/common';
import { users } from 'src/users/schema/user.schema';
import { UserDto } from 'src/users/user.dto';
import { eq } from 'drizzle-orm';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Injectable()
export class UserService {
  constructor(private drizzleService: DrizzleService) {}
  async createUser(UserDto: UserDto) {
    const { email, role, paymentMethodId } = UserDto;
    // Insert the new user
    const [newUser] = await this.drizzleService.db
      .insert(users)
      .values({
        email,
        role,
        paymentMethodId,
      })
      .returning();
    return newUser;
  }
  async getUserByEmail(email: string) {
    return await this.drizzleService.db.select().from(users).where(eq(users.email, email)).limit(1);
  }
}
