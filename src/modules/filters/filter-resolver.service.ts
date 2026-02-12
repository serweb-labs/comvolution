import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Product } from '../../orm/entities/product.entity';
import { FilterContext, FilterHandler, Operation, PropertyType } from './filter-handler';

@Injectable()
export class FilterResolverService {
  constructor(private readonly handlers: FilterHandler[]) {}

  private deriveOperation(value: any): Operation {
    if (Array.isArray(value)) return 'in';
    if (value && typeof value === 'object' && (('lt' in value) || ('gt' in value))) return 'ltgt';
    return 'eq';
  }

  applyAll(
    qb: SelectQueryBuilder<Product>,
    filters: Record<string, any>,
    ctxBase: Omit<FilterContext, 'propertyType'> & { propertyTypes?: Record<string, PropertyType> },
  ) {
    const coreKeys = ctxBase.coreKeys ?? new Set(['price', 'status', 'sku', 'stock', 'sku_in']);
    for (const [key, value] of Object.entries(filters ?? {})) {
      const op = this.deriveOperation(value);
      const propertyType = ctxBase.propertyTypes?.[key];
      const ctx: FilterContext = { coreKeys, propertyType, schemaId: ctxBase.schemaId };
      const candidates = this.handlers.filter((h) => h.supports(key, op, value, ctx));
      if (candidates.length === 0) {
        throw new (require('@nestjs/common').BadRequestException)(`Unsupported filter for key "${key}" with op "${op}"`);
      }
      const handler = candidates.sort((a, b) => b.priority - a.priority)[0];
      handler.apply(qb, key, op, value, ctx);
    }
  }
}
