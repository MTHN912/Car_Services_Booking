import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetNearbyDto {
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @Type(() => Number)
  @IsNumber()
  radius: number;
}
