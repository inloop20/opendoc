/*
  Warnings:

  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamMember` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `OrganizationMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `WorkspaceMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_userId_fkey";

-- AlterTable
ALTER TABLE "OrganizationMember" ADD COLUMN     "role" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WorkspaceMember" ADD COLUMN     "role" TEXT NOT NULL;

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "TeamMember";
