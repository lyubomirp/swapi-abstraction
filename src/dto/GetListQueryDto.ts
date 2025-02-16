import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ResourceType } from '../enums/ResourceType';
import { Transform } from 'class-transformer';

export class GetListQueryDto {
  @IsEnum(ResourceType, {
    message: 'invalid resource type',
  })
  resourceType: ResourceType;

  @IsNumber()
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must be at least 1' })
  @Transform(({ value }) => Number(value), {
    toClassOnly: true,
  })
  page?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
