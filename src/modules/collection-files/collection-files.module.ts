import { Module } from '@nestjs/common';
import { CollectionFilesService } from './collection-files.service';

@Module({
  providers: [CollectionFilesService],
  exports: [CollectionFilesService],
})
export class CollectionFilesModule {}
