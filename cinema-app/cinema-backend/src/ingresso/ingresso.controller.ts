import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { IngressoService } from './ingresso.service';
import { Prisma } from '@prisma/client';

@Controller('ingressos')
export class IngressoController {
  constructor(private readonly ingressoService: IngressoService) {}

  @Get()
  findAll() {
    return this.ingressoService.findAll();
  }

  @Get('sessao/:sessaoId')
  findBySessao(@Param('sessaoId', ParseIntPipe) sessaoId: number) {
    return this.ingressoService.findBySessao(sessaoId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ingressoService.findOne(id);
  }

  @Post()
  create(@Body() data: Prisma.IngressoCreateInput) {
    return this.ingressoService.create(data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.ingressoService.delete(id);
  }
}
