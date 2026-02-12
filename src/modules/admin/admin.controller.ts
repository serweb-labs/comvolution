import { Controller, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Post('reindex/:schemaId')
  async reindex(@Param('schemaId') schemaId: string) {
    return this.service.reindexSchema(schemaId);
  }
}
