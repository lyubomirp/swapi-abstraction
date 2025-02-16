import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ListReturnType } from './types/ListReturnType';

@Injectable()
export class SwapiService {
  private logger = new Logger('SwapiService');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async checkCache<T>(
    key: string,
  ): Promise<T | null> {
    const cachedData = await this.cacheManager.get(key);

    if (cachedData) {
      this.logger.log(`Cache hit for ${key}`);
      return cachedData as T;
    }

    this.logger.log(
      `Cache miss for ${key}, fetching from SWAPI...`,
    );

    return null;
  }

  private async callApi<T>({
    resource,
    page,
    id,
    search,
  }: {
    resource: string;
    page?: number;
    id?: number;
    search?: string;
  }): Promise<T> {
    let url: string = `${this.configService.get('swapi.base')}/${resource}`;

    if (page) {
      if (search) {
        url = `${url}/?page=${page}&search=${search}`;
      } else {
        url = `${url}/?page=${page}`;
      }
    } else {
      url = `${url}/${id}`;
    }
    console.log(url);

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<T>(url).pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
      );

      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to fetch ${resource}
           from SWAPI with error: ${error.message}`,
        );
      }

      throw error;
    }
  }

  private async cacheData<T>(cacheKey: string, data: T) {
    await this.cacheManager.set(cacheKey, data);
  }

  async fetchEntityData<T>(
    resource: string,
    id: number,
  ): Promise<T> {
    const cacheKey = `${resource}-${id}`;

    const result = await this.checkCache<T>(cacheKey);

    if (result) {
      return result as T;
    }

    const data = (await this.callApi({
      resource,
      id,
    })) as T;

    await this.cacheData<T>(cacheKey, data);

    return data;
  }

  async fetchListData<T>(
    resource: string,
    page: number = 1,
    search?: string,
  ): Promise<ListReturnType<T>> {
    const cacheKey = `${resource}-page-${page}${search ? `-${search.replaceAll(' ', '-').toLowerCase()}` : ''}`;
    const response =
      await this.checkCache<ListReturnType<T>>(cacheKey);

    if (response) {
      return response;
    }

    const data = await this.callApi<ListReturnType<T>>({
      resource,
      page,
      search,
    });

    await this.cacheData<ListReturnType<T>>(cacheKey, data);

    return data;
  }
}
