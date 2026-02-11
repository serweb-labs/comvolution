import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

type SortOrder = 'asc' | 'desc';

export type CollectionYaml = {
  id: string;
  name: string;
  schema_id: string;
  description?: string;
  filters?: Record<string, any>;
  sort?: Record<string, SortOrder>;
  pagination?: { pageSize?: number };
  metadata?: Record<string, any>;
};

@Injectable()
export class CollectionFilesService {
  private baseDir: string = process.env.COLLECTIONS_DIR || path.join(process.cwd(), 'collections');

  async get(id: string): Promise<CollectionYaml | null> {
    const file = fs.existsSync(path.join(this.baseDir, `${id}.yaml`))
      ? path.join(this.baseDir, `${id}.yaml`)
      : path.join(this.baseDir, `${id}.yaml.dist`);
    if (!fs.existsSync(file)) return null;
    const content = fs.readFileSync(file, 'utf8');
    let data: CollectionYaml;
    try {
      data = yaml.load(content) as CollectionYaml;
    } catch (e: any) {
      throw new (require('@nestjs/common').BadRequestException)(
        `Invalid collection YAML: ${e?.message ?? 'parse error'}`
      );
    }
    if (!data || typeof data !== 'object' || data.id !== id) return null;
    return data;
  }
}
