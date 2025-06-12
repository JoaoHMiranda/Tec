import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { SessaoService } from './sessao.service';
import { Prisma } from '@prisma/client';

@Controller('sessoes')
export class SessaoController {
  constructor(private readonly sessaoService: SessaoService) {}

  @Get()
  findAll() {
    return this.sessaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sessaoService.findOne(id);
  }

  @Post()
  create(@Body() data: Prisma.SessaoCreateInput) {
    return this.sessaoService.create(data);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: Prisma.SessaoUpdateInput) {
    return this.sessaoService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.sessaoService.delete(id);
  }
}
