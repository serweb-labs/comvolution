import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Product } from '../orm/entities/product.entity';
import { ProductProperty } from '../orm/entities/product-property.entity';

import { Collection } from '../orm/entities/collection.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'comvolution',
  password: process.env.DB_PASS || 'comvolution',
  database: process.env.DB_NAME || 'comvolution',
  entities: [Product, ProductProperty, Collection],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: false,
});
