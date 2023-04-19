/*
  Warnings:

  - You are about to alter the column `url` on the `ChatSpace` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "ChatSpace" ADD COLUMN     "description" VARCHAR(200),
ALTER COLUMN "url" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" VARCHAR(200),
ADD COLUMN     "picture" VARCHAR(500),
ADD COLUMN     "username" VARCHAR(100) NOT NULL DEFAULT 'default_user',
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);
