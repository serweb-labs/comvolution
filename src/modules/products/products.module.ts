import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../orm/entities/product.entity';
import { ProductProperty } from '../../orm/entities/product-property.entity';
import { SchemaFilesModule } from '../schema-files/schema-files.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { IndexingModule } from '../indexing/indexing.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductProperty]),
    IndexingModule,
    SchemaFilesModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
