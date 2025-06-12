import { Module } from '@nestjs/common';
import { SessaoService } from './sessao.service';
import { SessaoController } from './sessao.controller';

@Module({
  providers: [SessaoService],
  controllers: [SessaoController]
})
export class SessaoModule {}
