import "server-only";

import { db } from "~/server/db";
import { foldersTable, filesTable } from "~/server/db/schema";
import { and, eq, isNull, like } from "drizzle-orm";

async function getAllParentsForFolder(folderId: bigint) {
  const parents = [];
  let currentId: bigint | null = folderId;

  while (currentId !== null) {
    const folder = await db
      .select()
      .from(foldersTable)
      .where(eq(foldersTable.id, currentId));

    if (!folder) {
      throw new Error(`Folder with ID ${currentId} not found`);
    }

    parents.unshift(folder[0]);
    currentId = folder[0]?.parent ?? null;
  }

  return parents;
}

function getFolders(folderId: bigint) {
  return db
    .select()
    .from(foldersTable)
    .where(eq(foldersTable.parent, folderId))
    .orderBy(foldersTable.name);
}

function getFoldersWithSearch(ownerId: string, search?: string) {
  return db
    .select()
    .from(foldersTable)
    .where(
      and(
        eq(foldersTable.ownerId, ownerId),
        search ? like(foldersTable.name, `%${search}%`) : undefined,
      ),
    )
    .orderBy(foldersTable.name);
}

function getFiles(folderId: bigint) {
  return db
    .select()
    .from(filesTable)
    .where(eq(filesTable.parent, folderId))
    .orderBy(filesTable.name);
}

function getFilesWithSearch(ownerId: string, search?: string) {
  return db
    .select()
    .from(filesTable)
    .where(
      and(
        eq(filesTable.ownerId, ownerId),
        search ? like(filesTable.name, `%${search}%`) : undefined,
      ),
    )
    .orderBy(filesTable.name);
}

function getFolderById(folderId: bigint) {
  return db
    .select()
    .from(foldersTable)
    .where(eq(foldersTable.id, folderId))
    .then(([folder]) => folder);
}

function getRootFolderForUser(userId: string) {
  return db
    .select()
    .from(foldersTable)
    .where(and(eq(foldersTable.ownerId, userId), isNull(foldersTable.parent)))
    .then((res) => res[0]);
}

export const QUERIES = {
  getAllParentsForFolder,
  getFolders,
  getFiles,
  getFolderById,
  getRootFolderForUser,
  getFoldersWithSearch,
  getFilesWithSearch,
};
