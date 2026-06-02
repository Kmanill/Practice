import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email адреса користувача',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securepass123',
    description: 'Пароль',
  })
  @IsString()
  password: string;
}
