import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { FilmeService } from './filme.service';
import { CreateFilmeDto, UpdateFilmeDto } from './dto/cartazBase64';

@Controller('filmes')
export class FilmeController {
  constructor(private readonly filmeService: FilmeService) {}

  @Get()
  findAll() {
    return this.filmeService.findAll();
  }

  @Post()
  create(@Body() createFilmeDto: CreateFilmeDto) {
    return this.filmeService.create(createFilmeDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFilmeDto: UpdateFilmeDto) {
    return this.filmeService.update(+id, updateFilmeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filmeService.remove(+id);
  }
}
