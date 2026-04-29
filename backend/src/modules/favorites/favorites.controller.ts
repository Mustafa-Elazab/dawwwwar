import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../database/entities/user.entity';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class AddFavoriteDto {
  @ApiProperty()
  @IsString()
  merchantId: string;
}

@ApiTags('Favorites')
@ApiBearerAuth('access-token')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'List my favorite merchants' })
  findAll(@CurrentUser() user: UserEntity) {
    return this.favoritesService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a merchant to favorites' })
  add(@CurrentUser() user: UserEntity, @Body() dto: AddFavoriteDto) {
    return this.favoritesService.add(user.id, dto.merchantId);
  }

  @Delete(':merchantId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a merchant from favorites' })
  remove(@CurrentUser() user: UserEntity, @Param('merchantId') merchantId: string) {
    return this.favoritesService.remove(user.id, merchantId);
  }

  @Get(':merchantId/check')
  @ApiOperation({ summary: 'Check if merchant is in favorites' })
  check(@CurrentUser() user: UserEntity, @Param('merchantId') merchantId: string) {
    return this.favoritesService.isFavorite(user.id, merchantId);
  }
}
