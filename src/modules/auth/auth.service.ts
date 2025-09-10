import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  comparePassword,
  hashPassword,
} from '../../common/utils/password.util';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersRepo: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email đã có được đăng ký!');

    const hashed = await hashPassword(dto.password);
    const user = await this.usersRepo.createUser({
      ...dto,
      password: hashed,
    });

    const { password, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác');

    const valid = await comparePassword(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác');

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
