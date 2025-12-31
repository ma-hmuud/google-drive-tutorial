import "server-only";

import { db } from "~/server/db";
import { foldersTable, filesTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";

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
    .where(eq(foldersTable.parent, folderId));
}

function getFiles(folderId: bigint) {
  return db.select().from(filesTable).where(eq(filesTable.parent, folderId));
}

function getFolderById(folderId: bigint) {
  return db
    .select()
    .from(foldersTable)
    .where(eq(foldersTable.id, folderId))
    .then(([folder]) => folder);
}

export const QUERIES = {
  getAllParentsForFolder,
  getFolders,
  getFiles,
  getFolderById,
};
