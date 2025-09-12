import { IsIn, IsNumberString, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Tên phải có ít nhất 2 ký tự' })
  name?: string;

  @IsOptional()
  @IsIn(['male', 'female'], {
    message: 'Giới tính chỉ được chọn male hoặc female',
  })
  gender?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'Số điện thoại chỉ được chứa số' })
  phoneNumber?: string;
}
