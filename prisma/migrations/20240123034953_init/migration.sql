/*
  Warnings:

  - Added the required column `updated_at` to the `client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE');

-- AlterTable
ALTER TABLE "client" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted" BOOLEAN DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "invoice" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted" BOOLEAN DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted" BOOLEAN DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "provider" "AuthProvider" NOT NULL DEFAULT 'LOCAL',
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "forgot_password_id" TEXT,
    "roleId" TEXT NOT NULL,
    "deleted" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "create_client" BOOLEAN NOT NULL DEFAULT true,
    "read_client" BOOLEAN NOT NULL DEFAULT true,
    "update_client" BOOLEAN NOT NULL DEFAULT true,
    "delete_client" BOOLEAN NOT NULL DEFAULT true,
    "create_invoice" BOOLEAN NOT NULL DEFAULT true,
    "read_invoice" BOOLEAN NOT NULL DEFAULT true,
    "update_invoice" BOOLEAN NOT NULL DEFAULT true,
    "delete_invoice" BOOLEAN NOT NULL DEFAULT true,
    "create_project" BOOLEAN NOT NULL DEFAULT true,
    "read_project" BOOLEAN NOT NULL DEFAULT true,
    "update_project" BOOLEAN NOT NULL DEFAULT true,
    "delete_project" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history" (
    "id" BIGSERIAL NOT NULL,
    "activity" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "entity" TEXT NOT NULL,
    "rowId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
