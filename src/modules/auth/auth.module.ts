import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RedisService } from '../../common/redis/redis.service'; // thêm Redis service
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { UsersRepository } from '../users/users.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import jwtConfig from './jwt/jwt.config';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessToken.secret'),
        signOptions: {
          expiresIn: config.get<string>('jwt.accessToken.expiresIn'),
          algorithm: 'HS512',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersRepository,
    RedisService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
