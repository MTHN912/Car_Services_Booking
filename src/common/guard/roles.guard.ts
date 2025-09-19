import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { BusinessException } from '../exception-filter/bussines.exception';
import { AuthException } from '../exception-filter/auth.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!requiredRoles.includes(user.role)) {
      throw new AuthException(`Bạn không có quyền truy cập tài nguyên này`, HttpStatus.FORBIDDEN, 'FORBIDDEN_ERROR');
    }

    return true;
  }
}
