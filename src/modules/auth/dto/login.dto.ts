import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Tài khoản hoặc mật khẩu không chính xác' })
  @IsNotEmpty({ message: 'Tài khoản hoặc mật khẩu không chính xác' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Tài khoản hoặc mật khẩu không chính xác' })
  @IsNotEmpty({ message: 'Tài khoản hoặc mật khẩu không chính xác' })
  password: string;
}
