import { filesTable, foldersTable } from "./schema";
import { db } from ".";

async function createFile(input: {
  file: {
    name: string;
    size: number;
    fileUrl: string;
    parent: bigint;
    modified: string;
    ownerId: string;
  };
  userId: string;
}) {
  return db.insert(filesTable).values({
    name: input.file.name,
    size: BigInt(input.file.size),
    fileUrl: input.file.fileUrl,
    parent: input.file.parent,
    modified: input.file.modified,
    ownerId: input.userId,
  });
}

async function createRootFolder(ownerId: string) {
  const [rootFolder] = await db
    .insert(foldersTable)
    .values({
      name: "Root",
      modified: new Date().toISOString(),
      ownerId: ownerId,
      parent: null,
    })
    .$returningId();

  await db.insert(foldersTable).values([
    {
      name: "Documents",
      modified: new Date().toISOString(),
      ownerId: ownerId,
      parent: rootFolder?.id,
    },
    {
      name: "Photos",
      modified: new Date().toISOString(),
      ownerId: ownerId,
      parent: rootFolder?.id,
    },
    {
      name: "Archives",
      modified: new Date().toISOString(),
      ownerId: ownerId,
      parent: rootFolder?.id,
    },
  ]);

  return rootFolder;
}

async function createFolder(folder: { name: string, parentId: bigint }, userId: string) {
  const [newFolder] = await db.insert(foldersTable).values({
    name: folder.name,
    parent: folder.parentId,
    ownerId: userId,
    modified: new Date().toISOString(),
  }).$returningId();

  return newFolder;
}

export const MUTATIONS = {
  createFile,
  createRootFolder,
  createFolder,
};
