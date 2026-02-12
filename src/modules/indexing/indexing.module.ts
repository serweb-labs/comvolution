import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductProperty } from '../../orm/entities/product-property.entity';
import { Product } from '../../orm/entities/product.entity';
import { IndexingService } from './indexing.service';
import { DomainModule } from '../../domain/domain.module';
import { IndexingSubscriber } from './indexing.subscriber';
import { SchemaFilesModule } from '../schema-files/schema-files.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductProperty, Product]), DomainModule, SchemaFilesModule],
  providers: [IndexingService, IndexingSubscriber],
  exports: [IndexingService],
})
export class IndexingModule {}
