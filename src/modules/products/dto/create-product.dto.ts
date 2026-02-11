import { IsString, IsNumber, IsInt, IsIn, IsObject, IsOptional, IsNotEmpty, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  price!: number;

  @IsDefined()
  @Type(() => Number)
  @IsInt()
  stock!: number;

  @IsDefined()
  @IsIn(['active', 'inactive'])
  status!: 'active' | 'inactive';

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  schema_id!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  schema_version?: number;

  @IsObject()
  data!: Record<string, any>;
}
