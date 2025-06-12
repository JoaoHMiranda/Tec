import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SessaoService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.sessao.findMany({
      include: { filme: true, sala: true },
      orderBy: { dataHora: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.sessao.findUnique({
      where: { id },
      include: { filme: true, sala: true },
    });
  }

  create(data: Prisma.SessaoCreateInput) {
    return this.prisma.sessao.create({ data });
  }

  update(id: number, data: Prisma.SessaoUpdateInput) {
    return this.prisma.sessao.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.sessao.delete({ where: { id } });
  }
}
