import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TicketType, TicketPriority } from '../../../database/entities/support-ticket.entity';

export class CreateTicketDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @ApiProperty({ enum: TicketType })
  @IsEnum(TicketType)
  type: TicketType;

  @ApiProperty({ enum: TicketPriority, required: false })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class AddTicketMessageDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  isInternal?: boolean;
}

export class ResolveTicketDto {
  @ApiProperty()
  @IsString()
  finalDecision: string;

  @ApiProperty({ default: 0 })
  @IsOptional()
  refundAmount?: number;

  @ApiProperty({ default: 0 })
  @IsOptional()
  compensationAmount?: number;

  @ApiProperty({ default: 0 })
  @IsOptional()
  penaltyAmount?: number;
}
