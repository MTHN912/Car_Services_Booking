// src/stores/store.service.ts
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateStoreDto } from './dto/create-store.dto';
import { GetNearbyDto } from './dto/get-nearby.dto';
import { NearbyStoreDto } from './dto/nearby-store.dto';
import { StoreRepository } from './store.repository';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepo: StoreRepository) {}

  async create(dto: CreateStoreDto) {
    return this.storeRepo.create({
        ...dto,
    });
}


  async findNearby(query: GetNearbyDto) {
    const { latitude, longitude, radius } = query;
    const stores = await this.storeRepo.findNearby(latitude, longitude, radius);

    return plainToInstance(NearbyStoreDto, stores, {
      excludeExtraneousValues: true,
    });
}
}
