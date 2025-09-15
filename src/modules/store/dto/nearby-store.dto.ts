import { Expose, Exclude } from 'class-transformer';

export class NearbyStoreDto {
  @Exclude()
  id: string;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  latitude: number;

  @Expose()
  longitude: number;

  @Expose()
  distance: number;
}
