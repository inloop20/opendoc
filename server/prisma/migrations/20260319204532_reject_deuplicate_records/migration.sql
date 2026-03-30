/*
  Warnings:

  - A unique constraint covering the columns `[folderId,title]` on the table `Document` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,parentFolderId,name]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId,name]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Document_folderId_title_key" ON "Document"("folderId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_workspaceId_parentFolderId_name_key" ON "Folder"("workspaceId", "parentFolderId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_workspaceId_name_key" ON "Team"("workspaceId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_organizationId_name_key" ON "Workspace"("organizationId", "name");
