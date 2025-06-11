-- AlterTable
ALTER TABLE "QuizResult" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT;
