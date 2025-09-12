// create-store.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsNumber()
  latitude: number;   // bắt buộc

  @IsNumber()
  longitude: number;  // bắt buộc
}
