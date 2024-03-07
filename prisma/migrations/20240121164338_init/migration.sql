-- CreateTable
CREATE TABLE "client" (
    "id" INTEGER NOT NULL,
    "client_name" TEXT NOT NULL,
    "contact_info" TEXT DEFAULT 'Not provided',

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "id" INTEGER NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "amount_due" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" INTEGER NOT NULL,
    "project_name" TEXT NOT NULL DEFAULT 'new project',
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_client_name_key" ON "client"("client_name");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_invoice_number_key" ON "invoice"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "project_project_name_key" ON "project"("project_name");

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
