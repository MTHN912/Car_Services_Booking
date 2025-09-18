import { Injectable, OnModuleInit, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit, OnApplicationBootstrap {
  onModuleInit() {
    console.log('👉 [Init Phase] AppService đã được khởi tạo (OnModuleInit)');
  }

  onApplicationBootstrap() {
    console.log('🚀 [Bootstrap Phase] Ứng dụng đã bootstrap xong (OnApplicationBootstrap)');
  }

  getHello(): string {
    return 'Hello World!';
  }
}
