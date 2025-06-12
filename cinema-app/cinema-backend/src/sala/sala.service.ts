import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SalaService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.sala.findMany({ orderBy: { nome: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.sala.findUnique({ where: { id } });
  }

  create(data: Prisma.SalaCreateInput) {
    return this.prisma.sala.create({ data });
  }

  update(id: number, data: Prisma.SalaUpdateInput) {
    return this.prisma.sala.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.sala.delete({ where: { id } });
  }
}
