import {
  IsEnum,
  IsInt,
  IsNumber,
  Min,
} from 'class-validator';
import { ResourceType } from '../enums/ResourceType';
import { Transform } from 'class-transformer';

export class GetEntityQueryDto {
  @IsEnum(ResourceType)
  resourceType: ResourceType;

  @IsNumber()
  @IsInt({ message: 'id must be an integer' })
  @Min(1, { message: 'id must be at least 1' })
  @Transform(({ value }) => Number(value), {
    toClassOnly: true,
  })
  id: number;
}
