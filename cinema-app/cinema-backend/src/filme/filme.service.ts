import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFilmeDto, UpdateFilmeDto } from './dto/cartazBase64'; // Certifique-se de que os DTOs estão nesse arquivo

@Injectable()
export class FilmeService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.filme.findMany();
  }

  create(data: CreateFilmeDto) {
    return this.prisma.filme.create({ data });
  }

  update(id: number, data: UpdateFilmeDto) {
    return this.prisma.filme.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.filme.delete({ where: { id } });
  }
}
