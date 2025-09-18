import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { GetNearbyDto } from './dto/get-nearby.dto';
import { StoreService } from './store.service';

import { Roles } from '../../common/decorator/roles.decorator';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';

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
