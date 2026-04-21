import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ example: '01011111111', description: 'Egyptian mobile number' })
  @IsString()
  @Matches(/^(01[0125]\d{8}|\+2001[0125]\d{8})$/, {
    message: 'INVALID_PHONE',
  })
  phone: string;
}
