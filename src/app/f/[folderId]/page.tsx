import { eq } from "drizzle-orm";
import DriveContents from "~/app/drive-contents";
import { db } from "~/server/db";
import { folders as foldersTable, files as filesTable } from "~/server/db/schema";
import type { DriveFile, DriveFolder } from "~/types/drive";

async function getAllParents(folderId: bigint) {
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

export default async function FolderPage(props: {
  params: Promise<{ folderId: string }>
}) {
  const { folderId } = await props.params;

  const parsedFolderId = parseInt(folderId);
  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const foldersPromise = db.select().from(foldersTable).where(eq(foldersTable.parent, BigInt(parsedFolderId)));
  const filesPromise = db.select().from(filesTable).where(eq(filesTable.parent, BigInt(parsedFolderId)));
  const parentsPromise = getAllParents(BigInt(parsedFolderId));

  const [folders, files, parents] = await Promise.all([foldersPromise, filesPromise, parentsPromise]);

  return <DriveContents folders={folders as unknown as DriveFolder[]} files={files as unknown as DriveFile[]} parents={parents as unknown as DriveFolder[]} />;
}