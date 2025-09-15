import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service/auth.service';
import { JwtConfigModule } from './jwt/jwt.module';
import { TokenService } from './auth.service/token.service';
import { SessionService } from './auth.service/session.service';

@Module({
  imports: [
    PassportModule,
    JwtConfigModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    TokenService,
    SessionService
  ],
  exports: [AuthService],
})
export class AuthModule {}
