import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../orm/entities/product.entity';
import { SchemaFilesService } from '../schema-files/schema-files.service';
import { DomainEventsService } from '../../domain/events/domain-events.service';


@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly events: DomainEventsService,
    private readonly schemas: SchemaFilesService,
  ) {}

  async reindexSchema(schemaId: string) {
    const fields = await this.schemas.getFields(schemaId);
    if (!fields) throw new BadRequestException('Schema not found');
    this.events.emitSchemaReindexRequested(schemaId);
    const count = await this.productRepo.count({ where: { schema_id: schemaId } });
    return { schema_id: schemaId, scheduled: count };
  }
}
