import { Module } from '@nestjs/common';
import { SchemaFilesService } from './schema-files.service';

@Module({
  providers: [SchemaFilesService],
  exports: [SchemaFilesService],
})
export class SchemaFilesModule {}
