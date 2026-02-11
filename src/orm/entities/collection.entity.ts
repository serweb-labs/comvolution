import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('collection')
export class Collection {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  filters_json?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  sort_json?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  pagination_json?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata_json?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;
}
