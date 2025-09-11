import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PrismaService],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
