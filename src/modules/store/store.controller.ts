// src/stores/store.controller.ts
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { GetNearbyDto } from './dto/get-nearby.dto';
import { StoreService } from './store.service';

// Giả sử bạn đã có JWT + Role guard
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Roles } from '../users/role/roles.decorator';
import { RolesGuard } from '../users/role/roles.guard';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  // API: Admin thêm cửa hàng
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() dto: CreateStoreDto) {
    return this.storeService.create(dto);
  }

  // API: User lấy danh sách cửa hàng gần vị trí
  @UseGuards(JwtAuthGuard)
  @Get('nearby')
  async findNearby(@Query() query: GetNearbyDto) {
    return this.storeService.findNearby(query);
  }
}
