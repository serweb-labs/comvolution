import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SchemasService, CreateSchemaDto } from './schemas.service';

@Controller('schemas')
export class SchemasController {
  constructor(private readonly service: SchemasService) {}

  @Post()
  async create(@Body() dto: CreateSchemaDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Query('version') version?: string) {
    const v = version ? parseInt(version, 10) : undefined;
    return this.service.get(id, v);
  }
}
