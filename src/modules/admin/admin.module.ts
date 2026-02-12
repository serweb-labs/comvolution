import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../orm/entities/product.entity';
import { ProductProperty } from '../../orm/entities/product-property.entity';
import { IndexingModule } from '../indexing/indexing.module';
import { SchemaFilesModule } from '../schema-files/schema-files.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DomainModule } from '../../domain/domain.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductProperty]), IndexingModule, SchemaFilesModule, DomainModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
