/*
  Warnings:

  - Added the required column `classificacaoIndicativa` to the `Filme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataEstreia` to the `Filme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `Filme` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Sala" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "capacidade" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Sessao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filmeId" INTEGER NOT NULL,
    "salaId" INTEGER NOT NULL,
    "dataHora" DATETIME NOT NULL,
    "preco" REAL NOT NULL,
    "idioma" TEXT NOT NULL,
    "formato" TEXT NOT NULL,
    CONSTRAINT "Sessao_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "Filme" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Sessao_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ingresso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessaoId" INTEGER NOT NULL,
    "nomeCliente" TEXT NOT NULL,
    "cpfCliente" TEXT NOT NULL,
    "assento" TEXT NOT NULL,
    "tipoPagamento" TEXT NOT NULL,
    CONSTRAINT "Ingresso_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "Sessao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Filme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "classificacaoIndicativa" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL,
    "dataEstreia" DATETIME NOT NULL,
    "cartazBase64" TEXT
);
INSERT INTO "new_Filme" ("duracao", "genero", "id", "titulo") SELECT "duracao", "genero", "id", "titulo" FROM "Filme";
DROP TABLE "Filme";
ALTER TABLE "new_Filme" RENAME TO "Filme";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
