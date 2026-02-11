import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchemaDef } from '../../orm/entities/schema.entity';
import { SchemasService } from './schemas.service';
import { SchemasController } from './schemas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SchemaDef])],
  providers: [SchemasService],
  controllers: [SchemasController],
  exports: [SchemasService],
})
export class SchemasModule {}
