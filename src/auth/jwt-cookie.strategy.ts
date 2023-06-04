import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as jwksRsa from 'jwks-rsa';
import * as cookie from 'cookie';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookie',
) {
  constructor(configService: ConfigService) {
    super({
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${configService.get<string>(
          'AUTH0_DOMAIN',
        )}/.well-known/jwks.json`,
      }),
      jwtFromRequest: (req) => {
        // Extract the token from the cookie
        const cookies = req.headers.cookie;
        const parsedCookies = cookie.parse(cookies || '');
        const token = parsedCookies.token;
        return token;
      },
      audience: configService.get<string>('AUTH0_AUDIENCE'),
      issuer: `https://${configService.get<string>('AUTH0_DOMAIN')}/`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    try {
      if (!payload) {
        throw new UnauthorizedException();
      }
      return { userId: payload.sub };
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  }
}
