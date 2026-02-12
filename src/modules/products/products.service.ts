import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../orm/entities/product.entity';
import { SchemaFilesService } from '../schema-files/schema-files.service';
import { DomainEventsService } from '../../domain/events/domain-events.service';

type FieldDef = {
  type: 'string' | 'int' | 'bool' | 'date' | 'decimal';
  filterable?: boolean;
  sortable?: boolean;
  required?: boolean;
  default?: any;
};

export interface CreateProductDto {
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  schema_id: string;
  schema_version?: number;
  data: Record<string, any>;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
    private readonly schemas: SchemaFilesService,
    private readonly events: DomainEventsService,
  ) {}

  private validateAgainstSchema(data: Record<string, any>, fields: Record<string, FieldDef>) {
    if (!data || typeof data !== 'object') {
      throw new BadRequestException('data is required and must be an object');
    }
    for (const [key, def] of Object.entries(fields)) {
      const value = (data as any)?.[key];
      if (def.required && (value === undefined || value === null)) {
        throw new BadRequestException(`Missing required field: ${key}`);
      }
      if (value !== undefined && value !== null) {
        switch (def.type) {
          case 'string':
            if (typeof value !== 'string') throw new BadRequestException(`Invalid type for ${key}`);
            break;
          case 'int':
            if (typeof value !== 'number' || !Number.isInteger(value)) throw new BadRequestException(`Invalid type for ${key}`);
            break;
          case 'decimal':
            if (typeof value !== 'number') throw new BadRequestException(`Invalid type for ${key}`);
            break;
          case 'bool':
            if (typeof value !== 'boolean') throw new BadRequestException(`Invalid type for ${key}`);
            break;
          case 'date':
            if (isNaN(Date.parse(String(value)))) throw new BadRequestException(`Invalid date in ${key}`);
            break;
        }
      }
    }
  }

  async create(dto: CreateProductDto): Promise<Product> {
    if (typeof dto.sku !== 'string' || dto.sku.length === 0) {
      throw new BadRequestException('sku is required and must be a string');
    }
    if (typeof dto.schema_id !== 'string' || dto.schema_id.length === 0) {
      throw new BadRequestException('schema_id is required and must be a string');
    }
    if (typeof dto.price !== 'number' || Number.isNaN(dto.price)) {
      throw new BadRequestException('price is required and must be a number');
    }
    if (!Number.isInteger(dto.stock)) {
      throw new BadRequestException('stock is required and must be an integer');
    }
    if (dto.status !== 'active' && dto.status !== 'inactive') {
      throw new BadRequestException('status must be "active" or "inactive"');
    }
    const fields: Record<string, FieldDef> | null = await this.schemas.getFields(dto.schema_id);
    if (!fields) throw new BadRequestException('Schema not found');
    const safeData = (dto as any).data && typeof (dto as any).data === 'object' ? { ...(dto as any).data } : {};
    for (const [key, def] of Object.entries(fields)) {
      const v = (safeData as any)[key];
      if ((v === undefined || v === null) && def.default !== undefined) {
        (safeData as any)[key] = def.default;
      }
    }
    this.validateAgainstSchema(safeData, fields);

    const entity = this.repo.create({
      sku: dto.sku,
      price: String(dto.price.toFixed(2)),
      stock: dto.stock,
      status: dto.status,
      schema_id: dto.schema_id,
      schema_version: dto.schema_version ?? 1,
      data: safeData,
    });
    const saved = await this.repo.save(entity);
    this.events.emitProductCreated(saved.id);
    return saved;
  }

  async get(id: string): Promise<Product | null> {
    return this.repo.findOne({ where: { id } });
  }
}
