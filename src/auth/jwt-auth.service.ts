import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { SocketWithUserId } from 'src/chat/types';

@Injectable()
export class JwtAuthService {
  private client;

  constructor(private configService: ConfigService) {
    this.client = jwksClient({
      jwksUri: `https://${configService.get<string>(
        'AUTH0_DOMAIN',
      )}/.well-known/jwks.json`,
    });
  }

  validateToken(token: string, client: SocketWithUserId): Promise<boolean> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.getPublicKey,
        {
          audience: this.configService.get<string>('AUTH0_AUDIENCE'),
          issuer: `https://${this.configService.get<string>('AUTH0_DOMAIN')}/`,
          algorithms: ['RS256'],
        },
        (error, decoded) => {
          if (error) {
            console.error('Token validation error:', error);
            return resolve(false);
          }
          client.userId = decoded.sub;
          return resolve(true);
        },
      );
    });
  }

  getPublicKey = (header, callback) => {
    this.client.getSigningKey(header.kid, function (err, key) {
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  };
}
