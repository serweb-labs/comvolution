import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { Product } from '../../orm/entities/product.entity';
import { ProductProperty } from '../../orm/entities/product-property.entity';

import { Collection } from '../../orm/entities/collection.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: parseInt(config.get('DB_PORT', '5432'), 10),
        username: config.get('DB_USER', 'comvolution'),
        password: config.get('DB_PASS', 'comvolution'),
        database: config.get('DB_NAME', 'comvolution'),
        entities: [Product, ProductProperty, Collection],
        synchronize: false,
        logging: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
