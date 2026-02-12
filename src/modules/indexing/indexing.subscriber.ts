import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DomainEventsService } from '../../domain/events/domain-events.service';
import { Product } from '../../orm/entities/product.entity';
import { IndexingService } from './indexing.service';
import { SchemaFilesService } from '../schema-files/schema-files.service';

type FieldDef = {
  type: 'string' | 'int' | 'bool' | 'date' | 'decimal';
  filterable?: boolean;
  sortable?: boolean;
  required?: boolean;
  default?: any;
};

@Injectable()
export class IndexingSubscriber implements OnModuleInit {
  constructor(
    private readonly events: DomainEventsService,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly indexing: IndexingService,
    private readonly schemas: SchemaFilesService,
  ) {}

  onModuleInit() {
    this.events.productCreated$.subscribe(async ({ productId }) => {
      const product = await this.productRepo.findOne({ where: { id: productId } });
      if (!product) return;
      const fields = await this.schemas.getFields(product.schema_id);
      if (!fields) return;
      await this.indexing.rebuildProductIndex(product, fields as Record<string, FieldDef>);
    });

    this.events.schemaReindexRequested$.subscribe(async ({ schemaId }) => {
      const fields = await this.schemas.getFields(schemaId);
      if (!fields) return;
      const products = await this.productRepo.find({ where: { schema_id: schemaId } });
      for (const p of products) {
        await this.indexing.rebuildProductIndex(p, fields as Record<string, FieldDef>);
      }
    });
  }
}
