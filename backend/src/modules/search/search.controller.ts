import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Search')
@Controller('search')
@ApiBearerAuth('access-token')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Search merchants, products, categories' })
  @ApiQuery({ name: 'q', required: true })
  search(@Query('q') query: string) {
    return this.searchService.search(query);
  }
}
