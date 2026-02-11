import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

export type PropertyType = 'string' | 'int' | 'bool' | 'date' | 'decimal';

@Entity('product_properties')
export class ProductProperty {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  product_id!: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product?: Product;

  @Column({ type: 'text' })
  schema_id!: string;

  @Column({ type: 'int' })
  schema_version!: number;

  @Index()
  @Column({ type: 'text' })
  property_key!: string;

  @Column({ type: 'text' })
  property_type!: PropertyType;

  @Column({ type: 'text', nullable: true })
  value_string?: string | null;

  @Column({ type: 'int', nullable: true })
  value_int?: number | null;

  @Column({ type: 'bool', nullable: true })
  value_bool?: boolean | null;

  @Column({ type: 'timestamptz', nullable: true })
  value_date?: Date | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  value_decimal?: string | null;

  @Index()
  @Column({ type: 'text', nullable: true })
  value_casefold?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
