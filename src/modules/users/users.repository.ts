import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async createUser(data: any) {
    return this.prisma.user.create({
      data
    });
  }
  
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async updateUser(id: string, data: any) {
  return this.prisma.user.update({
    where: { id },
    data,
  });
}

}
