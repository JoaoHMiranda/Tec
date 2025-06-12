import { Module } from '@nestjs/common';
import { IngressoService } from './ingresso.service';
import { IngressoController } from './ingresso.controller';

@Module({
  providers: [IngressoService],
  controllers: [IngressoController]
})
export class IngressoModule {}
