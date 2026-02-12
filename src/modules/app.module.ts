import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';

import { ProductsModule } from './products/products.module';
import { CollectionsModule } from './collections/collections.module';
import { IndexingModule } from './indexing/indexing.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    ProductsModule,
    CollectionsModule,
    IndexingModule,
    AdminModule,
  ],
})
export class AppModule {}
