import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

type FieldDef = {
  type: 'string' | 'int' | 'bool' | 'date' | 'decimal';
  filterable?: boolean;
  sortable?: boolean;
  required?: boolean;
  label?: string;
};

type SchemaYaml = {
  id: string;
  fields: Record<string, FieldDef>;
  metadata?: Record<string, any>;
};

@Injectable()
export class SchemaFilesService {
  private baseDir: string = process.env.SCHEMAS_DIR || path.join(process.cwd(), 'schemas');

  async getFields(schemaId: string): Promise<Record<string, FieldDef> | null> {
    const file = fs.existsSync(path.join(this.baseDir, `${schemaId}.yaml`))
      ? path.join(this.baseDir, `${schemaId}.yaml`)
      : path.join(this.baseDir, `${schemaId}.yaml.dist`);
    if (!fs.existsSync(file)) return null;
    const content = fs.readFileSync(file, 'utf8');
    let data: SchemaYaml;
    try {
      data = yaml.load(content) as SchemaYaml;
    } catch (e: any) {
      throw new (require('@nestjs/common').BadRequestException)(
        `Invalid schema YAML: ${e?.message ?? 'parse error'}`
      );
    }
    if (!data || typeof data !== 'object' || data.id !== schemaId) return null;
    return data.fields || null;
  }
}
