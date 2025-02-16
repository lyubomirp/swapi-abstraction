import { Controller, Get, Query } from '@nestjs/common';
import { SwapiService } from './swapi.service';
import { GetListQueryDto } from './dto/GetListQueryDto';
import { GetEntityQueryDto } from './dto/GetEntityQueryDto';
import { ListReturnType } from './types/ListReturnType';

@Controller()
export class SwapiController {
  constructor(
    private readonly swapiService: SwapiService,
  ) {}

  @Get('entity-data')
  async fetchEntityData<T>(
    @Query() params: GetEntityQueryDto,
  ): Promise<T> {
    return await this.swapiService.fetchEntityData<T>(
      params.resourceType,
      params.id,
    );
  }

  @Get('list-data')
  async fetchListData<T>(
    @Query() params: GetListQueryDto,
  ): Promise<ListReturnType<T>> {
    return await this.swapiService.fetchListData<T>(
      params.resourceType,
      params.page,
      params.search,
    );
  }
}
