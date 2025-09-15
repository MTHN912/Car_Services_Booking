import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { StoreController } from './store.controller';
import { StoreRepository } from './store.repository';
import { StoreService } from './store.service';

@Module({
  controllers: [StoreController],
  providers: [StoreService, StoreRepository, PrismaService],
})
export class StoreModule {}
