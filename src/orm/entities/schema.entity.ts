import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('schema')
export class SchemaDef {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @PrimaryColumn({ type: 'int' })
  version!: number;

  @Column({ type: 'jsonb' })
  definition_json!: Record<string, any>;

  @Column({ type: 'bool', default: true })
  is_active!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
