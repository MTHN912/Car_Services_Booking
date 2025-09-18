import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { SessionId } from '../../common/decorator/session-id.decorator';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { AuthService } from './auth.service/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  @Post('refresh')
  async refresh(@SessionId() sessionId: string, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(sessionId, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any, @SessionId() sessionId: string, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req.user?.userId, sessionId, res);
  }
}
