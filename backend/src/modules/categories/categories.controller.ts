import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Categories')
@Controller('categories')
@ApiBearerAuth('access-token')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all active categories' })
  findAll(
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radiusKm') radiusKm?: string,
  ) {
    return this.categoriesService.findAll(
      lat ? parseFloat(lat) : undefined,
      lng ? parseFloat(lng) : undefined,
      radiusKm ? parseFloat(radiusKm) : undefined,
    );
  }

  @Get('tree')
  @Public()
  @ApiOperation({ summary: 'Get category tree (parents with children)' })
  getTree() {
    return this.categoriesService.getTree();
  }

  @Get('parents')
  @Public()
  @ApiOperation({ summary: 'Get root categories only' })
  getParents() {
    return this.categoriesService.getParents();
  }

  @Get(':parentId/children')
  @Public()
  @ApiOperation({ summary: 'Get children of a specific category' })
  getChildren(@Param('parentId') parentId: string) {
    return this.categoriesService.getChildren(parentId);
  }
}
