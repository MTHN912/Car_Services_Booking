import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { GetNearbyDto } from './dto/get-nearby.dto';
import { StoreService } from './store.service';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Roles } from '../users/role/roles.decorator';
import { RolesGuard } from '../users/role/roles.guard';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() dto: CreateStoreDto) {
    return this.storeService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('nearby')
  async findNearby(@Query() query: GetNearbyDto) {
    return this.storeService.findNearby(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-city')
  async findByCity(@Query('city') city: string) {
    return this.storeService.findByCity(city);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll() {
    return this.storeService.findAll();
  }
}
