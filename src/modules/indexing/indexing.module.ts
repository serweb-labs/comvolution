import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductProperty } from '../../orm/entities/product-property.entity';
import { Product } from '../../orm/entities/product.entity';
import { IndexingService } from './indexing.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductProperty, Product])],
  providers: [IndexingService],
  exports: [IndexingService],
})
export class IndexingModule {}
