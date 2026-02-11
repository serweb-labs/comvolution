import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductProperty, PropertyType } from '../../orm/entities/product-property.entity';
import { Product } from '../../orm/entities/product.entity';

type FieldDef = {
  type: PropertyType;
  filterable?: boolean;
  sortable?: boolean;
};

@Injectable()
export class IndexingService {
  constructor(
    @InjectRepository(ProductProperty)
    private readonly propRepo: Repository<ProductProperty>,
  ) {}

  async rebuildProductIndex(product: Product, fields: Record<string, FieldDef>) {
    await this.propRepo.delete({ product_id: product.id });
    for (const [key, def] of Object.entries(fields)) {
      if (!def.filterable && !def.sortable) continue;
      const raw = (product.data ?? {})[key];
      if (raw === undefined || raw === null) continue;

      const entity = this.propRepo.create({
        product_id: product.id,
        schema_id: product.schema_id,
        schema_version: product.schema_version,
        property_key: key,
        property_type: def.type,
      });

      switch (def.type) {
        case 'string':
          entity.value_string = String(raw);
          entity.value_casefold = String(raw).toLowerCase();
          break;
        case 'int':
          entity.value_int = Number(raw);
          break;
        case 'decimal':
          entity.value_decimal = String(raw);
          break;
        case 'bool':
          entity.value_bool = Boolean(raw);
          break;
        case 'date':
          entity.value_date = new Date(String(raw));
          break;
      }
      await this.propRepo.save(entity);
    }
  }
}
