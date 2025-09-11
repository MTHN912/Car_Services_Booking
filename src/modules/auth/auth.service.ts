import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../../common/redis/redis.service';
import { comparePassword, hashPassword } from '../../common/utils/password.util';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersRepo: UsersRepository,
    private jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<UserResponseDto> {
    const existing = await this.usersRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email đã được đăng ký!');

    const hashed = await hashPassword(dto.password);
    const user = await this.usersRepo.createUser({
      ...dto,
      password: hashed,
    });

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.usersRepo.findByEmail(dto.email);
    if (!user)
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác');

    const valid = await comparePassword(dto.password, user.password);
    if (!valid)
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác');

    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessToken.secret'),
      expiresIn: this.configService.get<string>('jwt.accessToken.expiresIn'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshToken.secret'),
      expiresIn: this.configService.get<string>('jwt.refreshToken.expiresIn'),
    });

    const ttl = 60 * 60 * 24 * 7;
    await this.redisService.set(`refresh:${user.id}`, refreshToken, ttl);

    // Tạo sessionId ngẫu nhiên
    const sessionId = uuidv4();

    // Lưu mapping sessionId -> refreshToken vào Redis
    await this.redisService.set(`session:${sessionId}`, refreshToken, ttl);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('session_id', sessionId , {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: ttl * 1000,
    });

      return {
        message: 'Đăng nhập thành công',
        user: plainToInstance(UserResponseDto, user, {
          excludeExtraneousValues: true,
        }),
      };
  }

  async refresh(sessionId: string, res: Response) {
  // Lấy refresh token gốc từ Redis bằng sessionId
  const refreshToken = await this.redisService.get(`session:${sessionId}`);
  if (!refreshToken) {
    throw new ForbiddenException('Session không hợp lệ hoặc đã hết hạn');
  }
  let payload: any;
  try {
    payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('jwt.refreshToken.secret'),
    });
  } catch (e) {
    throw new ForbiddenException('Refresh token không hợp lệ hoặc đã hết hạn');
  }

  const user = await this.usersRepo.findById(payload.sub);
  if (!user) throw new UnauthorizedException('User không tồn tại');

  const newAccessToken = this.jwtService.sign(
    { sub: user.id, email: user.email, role: user.role },
    {
      secret: this.configService.get<string>('jwt.accessToken.secret'),
      expiresIn: this.configService.get<string>('jwt.accessToken.expiresIn'),
    },
  );

  res.cookie('access_token', newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  return { access_token: newAccessToken };
}

  async logout(userId: string, sessionId: string, res: Response) {
    await this.redisService.del(`session:${sessionId}`);
    await this.redisService.del(`refresh:${userId}`);
    res.clearCookie('access_token');
    res.clearCookie('session_id');
    return { message: 'Đăng xuất thành công' };
  }

}
