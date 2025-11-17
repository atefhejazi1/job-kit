-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER', 'COMPANY');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "user_type" "UserType" NOT NULL DEFAULT 'USER';
