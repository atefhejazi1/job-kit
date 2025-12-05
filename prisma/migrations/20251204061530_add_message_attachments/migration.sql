-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "messageType" TEXT NOT NULL DEFAULT 'text';
