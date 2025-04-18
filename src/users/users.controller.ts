import { Controller, Post, BadRequestException, Req } from '@nestjs/common';
import { Request } from 'express';
import * as jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { UserDto } from './user.dto';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  private client = jwksClient({
    jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
  });
  constructor(private readonly userService: UserService) {}

  @Post()
  async handleWebhook(@Req() req: Request) {
    try {
      // Get the token from the request using raw body handling
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(Buffer.from(chunk));
      }
      const token = Buffer.concat(chunks).toString('utf8');

      if (!token) {
        throw new BadRequestException('Token is missing');
      }

      // Decode the token
      const decoded = jwt.decode(token, { complete: true }) as any;
      if (!decoded || !decoded.header) {
        throw new BadRequestException('Invalid token');
      }

      const { kid } = decoded.header;
      const key = await this.client.getSigningKey(kid);
      const signingKey = key.getPublicKey();

      // Verify the token
      const event = jwt.verify(token, signingKey) as any;
      console.log('User created:', event.data);
      // Handle various events
      switch (event?.type) {
        case 'user.updated':
          break;

        case 'user.created':
          const userDto = new UserDto();
          userDto.email = event.data.user.email;
          userDto.role = 'user'; // Default role for new users

          // Save the user to the database
          const newUser = await this.userService.createUser(userDto);
          console.log('User successfully saved to database:', newUser);
          break;

        default:
          // other events that we don't handle
          console.log('Unhandled event type:', event.type);
          break;
      }

      return { status: 200, statusText: 'success' };
    } catch (err) {
      console.error('Webhook error:', err.message);
      throw new BadRequestException(err.message);
    }
  }
}
