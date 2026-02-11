import { Module } from '@nestjs/common';
import { Product } from '../../orm/entities/product.entity';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { ProductProperty } from '../../orm/entities/product-property.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionFilesModule } from '../collection-files/collection-files.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductProperty]), CollectionFilesModule],
  providers: [CollectionsService],
  controllers: [CollectionsController],
  exports: [CollectionsService],
})
export class CollectionsModule {}
