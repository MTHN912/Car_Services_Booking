import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Không có người dùng nào có là: ${id}`);
    }
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  async getUserByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return null;
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findAll();
    return plainToInstance(UserResponseDto, users, { excludeExtraneousValues: true });
  }
}
