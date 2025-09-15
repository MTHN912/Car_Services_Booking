import { Expose } from 'class-transformer';

export class StoreListDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  createdAt: Date;
}
