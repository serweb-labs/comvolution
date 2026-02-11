import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';

import { ProductsModule } from './products/products.module';
import { CollectionsModule } from './collections/collections.module';
import { IndexingModule } from './indexing/indexing.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    ProductsModule,
    CollectionsModule,
    IndexingModule,
  ],
})
export class AppModule {}
