// src/property/dto/property-query.dto.ts
import { IsOptional, IsNumber, IsString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class PropertyQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @IsOptional()
  @IsString()
  search?: string;

  // Add other filter fields as needed
  @IsOptional()
  @IsString()
  name?: string;

  //   @IsOptional()
  //   @Transform(({ value }) => parseInt(value))
  //   @IsNumber()
  //   minArea?: number;

  //   @IsOptional()
  //   @Transform(({ value }) => parseInt(value))
  //   @IsNumber()
  //   maxArea?: number;
}
