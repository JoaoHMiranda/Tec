import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { SalaService } from './sala.service';
import { Prisma } from '@prisma/client';

@Controller('salas')
export class SalaController {
  constructor(private readonly salaService: SalaService) {}

  @Get()
  findAll() {
    return this.salaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salaService.findOne(id);
  }

  @Post()
  create(@Body() data: Prisma.SalaCreateInput) {
    return this.salaService.create(data);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: Prisma.SalaUpdateInput) {
    return this.salaService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.salaService.delete(id);
  }
}
