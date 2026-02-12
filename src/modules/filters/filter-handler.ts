import { SelectQueryBuilder } from 'typeorm';
import { Product } from '../../orm/entities/product.entity';

export type Operation = 'eq' | 'in' | 'ltgt';

export type PropertyType = 'string' | 'int' | 'bool' | 'date' | 'decimal';

export type FilterContext = {
  coreKeys: Set<string>;
  propertyType?: PropertyType;
  schemaId?: string;
};

export interface FilterHandler {
  id: string;
  priority: number;
  supports(key: string, op: Operation, value: any, ctx: FilterContext): boolean;
  apply(qb: SelectQueryBuilder<Product>, key: string, op: Operation, value: any, ctx: FilterContext): void;
}
