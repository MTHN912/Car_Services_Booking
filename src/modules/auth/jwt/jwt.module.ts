import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
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
  exports: [JwtModule],
})
export class JwtConfigModule {}
