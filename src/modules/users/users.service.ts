import { HttpStatus, Injectable} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RedisService } from '../../common/redis/redis.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { BusinessException } from 'src/common/exception-filter/bussines.exception';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly redisService: RedisService,
  ) {}

  async getUserById(id: string): Promise<UserResponseDto> {
    const cacheKey = `user:${id}`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new BusinessException(`Không có người dùng nào có id: ${id}`, HttpStatus.NOT_FOUND);
    }

    const result = plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
    await this.redisService.setWithType(cacheKey, JSON.stringify(result), 'USER');

    return result;
  }

  async getUserByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return null;
      return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true
    });
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const cacheKey = `users:all`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const users = await this.usersRepository.findAll();
    const result = plainToInstance(UserResponseDto, users, { excludeExtraneousValues: true });

    await this.redisService.setWithType(cacheKey, JSON.stringify(result), 'USERS');

    return result;
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const updatedUser = await this.usersRepository.updateUser(id, dto);

    if (!updatedUser) {
      throw new BusinessException(`Không tìm thấy user với id: ${id}`, HttpStatus.NOT_FOUND);
    }

    const result = plainToInstance(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });

    await this.redisService.del(`user:${id}`);
    await this.redisService.del(`users:all`);
    await this.redisService.setWithType(`user:${id}`, JSON.stringify(result), 'USERS');

    return result;
  }

}
