import { SelectQueryBuilder } from 'typeorm';
import { Product } from '../../orm/entities/product.entity';

export type SortDir = 'asc' | 'desc';

export type PropertyType = 'string' | 'int' | 'bool' | 'date' | 'decimal';

export type SortContext = {
  coreKeys: Set<string>;
  propertyType?: PropertyType;
  schemaId?: string;
};

export interface SortHandler {
  id: string;
  priority: number;
  supports(key: string, dir: SortDir, ctx: SortContext): boolean;
  apply(qb: SelectQueryBuilder<Product>, key: string, dir: SortDir, ctx: SortContext): void;
}
