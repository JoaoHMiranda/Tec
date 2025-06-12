import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { FilmeModule } from './filme/filme.module';
import { SalaModule } from './sala/sala.module';
import { SessaoModule } from './sessao/sessao.module';
import { IngressoModule } from './ingresso/ingresso.module';

@Module({
  imports: [
    PrismaModule,
    FilmeModule,
    SalaModule,
    SessaoModule,
    IngressoModule,
  ],
})
export class AppModule {}
