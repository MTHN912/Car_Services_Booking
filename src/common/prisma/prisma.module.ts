import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // để không cần import đi import lại nhiều lần
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
