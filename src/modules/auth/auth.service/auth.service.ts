import { BadRequestException, HttpStatus, Injectable} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { comparePassword, hashPassword } from '../../../common/utils/password.util';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { UsersRepository } from '../../users/users.repository';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { SessionService } from './session.service';
import { TokenService } from './token.service';
import { AuthException } from 'src/common/exception-filter/auth.exception';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService
  ) {}

  async register(dto: RegisterDto): Promise<UserResponseDto> {
    const existing = await this.usersRepo.findByEmail(dto.email);
    if (existing)
    //  throw new ConflictException('Email đã được đăng ký!');
      throw new AuthException('Email đã được đăng ký!', HttpStatus.CONFLICT, 'USER_EMAIL_EXISTS');

    const hashed = await hashPassword(dto.password);
    const user = await this.usersRepo.createUser({
      ...dto,
      password: hashed,
    });

    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.usersRepo.findByEmail(dto.email);
    if (!user || !(await comparePassword(dto.password, user.password))) {
      throw new AuthException('Tài khoản hoặc mật khẩu không chính xác', HttpStatus.UNAUTHORIZED, 'INVALID_PASSWORD');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.tokenService.createAccessToken(payload);
    const refreshToken = this.tokenService.createRefreshToken(payload);

    await this.sessionService.saveRefreshToken(user.id, refreshToken);

    const sessionId = uuidv4();
    await this.sessionService.saveSession(sessionId, refreshToken);

    res.cookie('access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 15 * 60 * 1000 });
    res.cookie('session_id', sessionId, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

    return {
      message: 'Đăng nhập thành công',
      user: plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }),
    };
  }

  async refresh(sessionId: string, res: Response) {
    const refreshToken = await this.sessionService.getSession(sessionId);
    if (!refreshToken) throw new AuthException('Session không hợp lệ hoặc đã hết hạn', HttpStatus.FORBIDDEN);

    let payload: any;
    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new AuthException('Refresh token không hợp lệ hoặc đã hết hạn', HttpStatus.FORBIDDEN);
    }

    const user = await this.usersRepo.findById(payload.sub);
    if (!user) throw new AuthException('User không tồn tại', HttpStatus.UNAUTHORIZED);

    const newAccessToken = this.tokenService.createAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie('access_token', newAccessToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 15 * 60 * 1000 });
    return { access_token: newAccessToken };
  }

  async logout(userId: string, sessionId: string, res: Response) {
    await this.sessionService.clearSession(userId, sessionId);
    res.clearCookie('access_token');
    res.clearCookie('session_id');
    return { message: 'Đăng xuất thành công' };
  }
}
