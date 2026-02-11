import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'text' })
  sku!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price!: string;

  @Column({ type: 'int' })
  stock!: number;

  @Column({ type: 'text' })
  status!: string;

  @Index()
  @Column({ type: 'text' })
  schema_id!: string;

  @Index()
  @Column({ type: 'int' })
  schema_version!: number;

  @Column({ type: 'jsonb' })
  data!: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;
}
