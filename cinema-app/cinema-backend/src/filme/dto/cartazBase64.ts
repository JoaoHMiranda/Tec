// src/filme/dto/filme.dto.ts

export class CreateFilmeDto {
  titulo: string;
  descricao: string;
  genero: string;
  classificacaoIndicativa: string;
  duracao: number;
  dataEstreia: Date;
  cartazBase64?: string;
}

export class UpdateFilmeDto {
  titulo?: string;
  descricao?: string;
  genero?: string;
  classificacaoIndicativa?: string;
  duracao?: number;
  dataEstreia?: Date;
  cartazBase64?: string;
}
