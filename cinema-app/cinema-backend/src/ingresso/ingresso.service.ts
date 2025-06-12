import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class IngressoService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.ingresso.findMany({
      include: { sessao: { include: { filme: true, sala: true } } },
      orderBy: { id: 'desc' },
    });
  }

  findBySessao(sessaoId: number) {
    return this.prisma.ingresso.findMany({
      where: { sessaoId },
      orderBy: { assento: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.ingresso.findUnique({
      where: { id },
      include: { sessao: true },
    });
  }

  create(data: Prisma.IngressoCreateInput) {
    return this.prisma.ingresso.create({ data });
  }

  delete(id: number) {
    return this.prisma.ingresso.delete({ where: { id } });
  }
}
