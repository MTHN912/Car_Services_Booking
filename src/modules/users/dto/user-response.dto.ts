import { Exclude, Expose} from 'class-transformer';

export class UserResponseDto {
  @Exclude()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name?: string;

  @Exclude()
  role: string;

  @Expose()
  gender?: string;

  @Expose()
  address?: string;

  @Expose()
  phoneNumber?: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  password: string;
}
