import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditLog } from '@prisma/client';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(params: {
    actorId?: string;
    action: string;
    model: string;
    entityId?: string;
    before?: any;
    after?: any;
    ip?: string;
  }): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        action: params.action,
        model: params.model,
        entityId: params.entityId,
        before: params.before,
        after: params.after,
        ip: params.ip,
      },
    });
  }
}
