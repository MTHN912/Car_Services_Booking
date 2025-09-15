import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../common/redis/redis.service';
;

@Injectable()
export class SessionService {
  constructor(private readonly redisService: RedisService) {}

  async saveRefreshToken(userId: string, refreshToken: string) {
    await this.redisService.setWithType(`refresh:${userId}`, refreshToken, 'REFRESH_TOKEN');
  }

  async saveSession(sessionId: string, refreshToken: string) {
    await this.redisService.setWithType(`session:${sessionId}`, refreshToken, 'SESSION');
  }

  async getSession(sessionId: string) {
    return this.redisService.get(`session:${sessionId}`);
  }

  async clearSession(userId: string, sessionId: string) {
    await this.redisService.del(`session:${sessionId}`);
    await this.redisService.del(`refresh:${userId}`);
    await this.redisService.del(`user:${userId}`);
  }
}
