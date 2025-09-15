import { IsString, IsNumber } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  street: string;

  @IsString()
  ward: string;

  @IsString()
  city: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
