import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { promisify } from 'util';
import { UserService } from 'src/users/users.service';

// Define interfaces for JWT payload and decoded token
interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
  [key: string]: any;
}

interface DecodedToken {
  header: {
    alg: string;
    typ: string;
    kid: string;
  };
  payload: JwtPayload;
  signature: string;
}

@Injectable()
export class KindeAuthGuard implements CanActivate {
  private readonly client: jwksClient.JwksClient;

  constructor(
    private userService: UserService
  ) {
    if (!process.env.KINDE_ISSUER_URL) {
      throw new Error('KINDE_ISSUER_URL environment variable is not set');
    }
    
    this.client = jwksClient({
      jwksUri: process.env.KINDE_JWKS_URI || `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Authentication token not found');
    }

    try {
      const user = await this.verifyToken(token);
      request.user = user;
      
      const email = user.email;
      if (!email) {
        throw new UnauthorizedException('Email not found in token');
      }
      
      const userResult = await this.userService.getUserByEmail(email);
      
      if (userResult.length > 0) {
        const userRecord = userResult[0];
        request.user_id = userRecord.userId;
        request.user_email = email;
        request.user_role = userRecord.role;
      } else {
        throw new UnauthorizedException('User not found');
      }
      
      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }
      console.error(error);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  private async getSigningKey(kid: string): Promise<string> {
    try {
      const key = await this.client.getSigningKey(kid);
      return key.getPublicKey();
    } catch (error) {
      throw new UnauthorizedException('Unable to verify token signature');
    }
  }

  private async verifyToken(token: string): Promise<JwtPayload> {
    const decoded = jwt.decode(token, { complete: true }) as DecodedToken | null;
    
    if (!decoded?.header?.kid) {
      throw new UnauthorizedException('Invalid token format');
    }
    
    if (!process.env.KINDE_ISSUER_URL) {
      throw new Error('Required environment variables are not set');
    }
    
    const publicKey = await this.getSigningKey(decoded.header.kid);
    
    return promisify<string, string, jwt.VerifyOptions, JwtPayload>(jwt.verify)(
      token,
      publicKey,
      {
        algorithms: ['RS256'],
        issuer: process.env.KINDE_ISSUER_URL,
        complete: false,
      },
    );
  }
}