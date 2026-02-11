import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchemaDef } from '../../orm/entities/schema.entity';

export interface FieldDef {
  type: 'string' | 'int' | 'bool' | 'date' | 'decimal';
  filterable?: boolean;
  sortable?: boolean;
  required?: boolean;
  label?: string;
}

export interface CreateSchemaDto {
  id: string;
  version?: number;
  fields: Record<string, FieldDef>;
  metadata?: Record<string, any>;
}

@Injectable()
export class SchemasService {
  constructor(
    @InjectRepository(SchemaDef)
    private readonly repo: Repository<SchemaDef>,
  ) {}

  async create(dto: CreateSchemaDto): Promise<SchemaDef> {
    const latest = await this.repo.findOne({
      where: { id: dto.id },
      order: { version: 'DESC' },
    });
    const version = dto.version ?? ((latest?.version ?? 0) + 1);
    const entity = this.repo.create({
      id: dto.id,
      version,
      definition_json: {
        fields: dto.fields,
        metadata: dto.metadata ?? {},
      },
      is_active: true,
    });
    return this.repo.save(entity);
  }

  async get(id: string, version?: number): Promise<SchemaDef | null> {
    if (version !== undefined) {
      return this.repo.findOne({ where: { id, version } });
    }
    return this.repo.findOne({ where: { id }, order: { version: 'DESC' } });
  }
}
