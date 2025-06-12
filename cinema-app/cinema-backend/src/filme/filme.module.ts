import { Module } from '@nestjs/common';
import { FilmeService } from './filme.service';
import { FilmeController } from './filme.controller';

@Module({
  providers: [FilmeService],
  controllers: [FilmeController]
})
export class FilmeModule {}
