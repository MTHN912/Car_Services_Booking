import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Access token đã hết hạn');
      }

      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Access token không hợp lệ');
      }

      throw new UnauthorizedException('Bạn chưa đăng nhập');
    }
    return user;
  }
}
