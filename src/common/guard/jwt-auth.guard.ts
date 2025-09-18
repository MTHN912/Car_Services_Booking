import { HttpStatus, Injectable} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BusinessException } from '../exception-filter/bussines.exception';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new BusinessException('Access token đã hết hạn', HttpStatus.UNAUTHORIZED);
      }

      if (info?.name === 'JsonWebTokenError') {
        throw new BusinessException('Access token không hợp lệ', HttpStatus.UNAUTHORIZED);
      }

      throw new BusinessException('Bạn chưa đăng nhập', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
