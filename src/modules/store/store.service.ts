import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateStoreDto } from './dto/create-store.dto';
import { GetNearbyDto } from './dto/get-nearby.dto';
import { NearbyStoreDto } from './dto/nearby-store.dto';
import { StoreRepository } from './store.repository';
import { StoreListDto } from './dto/store-list.dto';

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

  async findByCity(city: string) {
    const stores = await this.storeRepo.findByCity(city);

    return plainToInstance(NearbyStoreDto, stores, {
      excludeExtraneousValues: true,
    });
  }

  async findAll() {
    const stores = await this.storeRepo.findAll();
      return plainToInstance(StoreListDto, stores, {
        excludeExtraneousValues: true,
    });
  }
}
