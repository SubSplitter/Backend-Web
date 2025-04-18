import { Injectable, NotFoundException } from '@nestjs/common';
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
  async getUserUuidByRequestEmail(request: any) {
    const userEmail = request.user_email;
    console.log('User email from request:', userEmail);

    // Use the existing getUserByEmail method to fetch the user
    const userResult = await this.getUserByEmail(userEmail);

    // getUserByEmail returns an array due to the select() from drizzle
    // Since you used limit(1), you can get the first (and only) user
    const user = userResult[0];

    if (!user) {
      throw new NotFoundException(`User with email ${userEmail} not found`);
    }

    return user.userId; // Return just the UUID
  }
}
