import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly prisma: PrismaService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const { method, user, body, ip, params } = req;

    // Thông tin cơ bản
    const actorId = user?.id ?? undefined;
    const controller = context.getClass().name; // AuthController, UsersController
    const handler = context.getHandler().name; // login, register, updateUser...
    const model = controller.replace('Controller', ''); // "Auth" hoặc "Users"

    let entityId: string | undefined = params?.id ?? body?.id ?? undefined;
    let before: any = null;

    return next.handle().pipe(
      tap(async (data) => {
        // Nếu chưa có entityId, thử lấy từ response (vd: createUser trả về user.id)
        if (!entityId && data?.id) {
          entityId = data.id;
        }

        // Xác định action
        const action = this.mapAction(controller, handler, method);

        // Nếu là UPDATE/DELETE → lấy snapshot trước khi thay đổi
        if (['UPDATE', 'DELETE'].includes(action) && model === 'Users' && entityId) {
          try {
            before = await this.prisma.user.findUnique({ where: { id: entityId } });
          } catch {
            before = null;
          }
        }

        // Chuẩn bị after
        let after: any = data ?? null;
        if (action === 'DELETE') {
          after = null;
        }

        // Mask thông tin nhạy cảm
        before = this.maskSensitive(before);
        after = this.maskSensitive(after);

        // Ghi log nếu action thuộc whitelist
        if (this.shouldLogAction(action)) {
          await this.auditLogService.createLog({
            actorId,
            action,
            model,
            entityId,
            before,
            after,
            ip,
          });
        }
      }),
    );
  }

  // Xác định action dựa vào controller + handler + method
  private mapAction(controller: string, handler: string, method: string): string {
    if (controller.includes('Auth')) {
      switch (handler) {
        case 'login':
          return 'LOGIN';
        case 'logout':
          return 'LOGOUT';
        case 'register':
          return 'REGISTER';
        default:
          return method;
      }
    }

    if (controller.includes('Users')) {
      switch (handler) {
        case 'createUser':
          return 'CREATE';
        case 'updateUser':
        case 'updateProfile':
        case 'updateMe':
          return 'UPDATE';
        case 'deleteUser':
          return 'DELETE';
        default:
          // fallback theo HTTP method
          if (method === 'POST') return 'CREATE';
          if (method === 'PATCH' || method === 'PUT') return 'UPDATE';
          if (method === 'DELETE') return 'DELETE';
          return method;
      }
    }

    // fallback cuối
    if (method === 'POST') return 'CREATE';
    if (method === 'PATCH' || method === 'PUT') return 'UPDATE';
    if (method === 'DELETE') return 'DELETE';
    return method;
  }

  // Chỉ log action nằm trong whitelist
  private shouldLogAction(action: string): boolean {
    const whitelist = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'REGISTER'];
    return whitelist.includes(action);
  }

  // Xoá thông tin nhạy cảm khỏi log
  private maskSensitive(data: any): any {
    if (!data) return data;
    const clone = { ...data };
    if ('password' in clone) clone.password = '[FILTERED]';
    if ('refreshToken' in clone) clone.refreshToken = '[FILTERED]';
    if ('accessToken' in clone) clone.accessToken = '[FILTERED]';
    return clone;
  }
}
