import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessToken.secret'),
      expiresIn: this.configService.get<string>('jwt.accessToken.expiresIn'),
    });
  }

  createRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshToken.secret'),
      expiresIn: this.configService.get<string>('jwt.refreshToken.expiresIn'),
    });
  }

  verifyRefreshToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('jwt.refreshToken.secret'),
    });
  }
}
