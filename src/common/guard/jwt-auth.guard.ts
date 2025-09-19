import { HttpStatus, Injectable} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthException } from '../exception-filter/auth.exception';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new AuthException('Access token đã hết hạn', HttpStatus.UNAUTHORIZED,'TOKEN_EXPIRED');
      }

      if (info?.name === 'JsonWebTokenError') {
        throw new AuthException('Access token không hợp lệ', HttpStatus.UNAUTHORIZED, 'TOKEN_INVALID');
      }

      throw new AuthException('Bạn chưa đăng nhập', HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED_ERROR');
    }
    return user;
  }
}
