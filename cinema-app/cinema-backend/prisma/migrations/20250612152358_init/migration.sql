-- CreateTable
CREATE TABLE "Filme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "classificacaoIndicativa" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL,
    "dataEstreia" DATETIME NOT NULL,
    "cartazBase64" TEXT
);

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
