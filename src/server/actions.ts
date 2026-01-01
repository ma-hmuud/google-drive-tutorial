"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { filesTable, foldersTable } from "./db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { MUTATIONS } from "./db/mutations";
import { folderSchema } from "~/lib/schemas";

const utApi = new UTApi();

type FolderActionResult = {
  error?: string;
  success?: {
    folderId: number;
    name: string;
  };
};

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  const file = await db
    .select()
    .from(filesTable)
    .where(
      and(
        eq(filesTable.id, BigInt(fileId)),
        eq(filesTable.ownerId, session.userId),
      ),
    );

  if (!file || file.length === 0 || !file[0]) {
    throw new Error("File not found");
  }

  const deleteResult = await utApi.deleteFiles([
    file[0].fileUrl.replace("https://lgi46d9iqy.ufs.sh/f/", ""),
  ]);

  if (!deleteResult.success) {
    throw new Error("Failed to delete file");
  }

  await db.delete(filesTable).where(eq(filesTable.id, file[0].id));

  return { success: true };
}

export async function deleteFolder(folderId: number) {
  const session = await auth();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  const folder = await db
    .select()
    .from(foldersTable)
    .where(
      and(
        eq(foldersTable.id, BigInt(folderId)),
        eq(foldersTable.ownerId, session.userId),
      ),
    );

  if (!folder || folder.length === 0 || !folder[0]) {
    throw new Error("Folder not found");
  }

  const childrenFilesPromise = getAllChildrenFile(folderId);
  const childrenFoldersPromise = getAllChildrenFolder(folderId);
  const [childrenFolders, childrenFiles] = await Promise.all([
    childrenFoldersPromise,
    childrenFilesPromise,
  ]);

  if (childrenFolders.length > 0) {
    throw new Error("Folder has children folders. Delete them first.");
  }

  await Promise.all([
    utApi.deleteFiles(
      childrenFiles.map((file) =>
        file.fileUrl.replace("https://lgi46d9iqy.ufs.sh/f/", ""),
      ),
    ),

    db.delete(filesTable).where(
      inArray(
        filesTable.id,
        childrenFiles.map((file) => file.id),
      ),
    ),

    db.delete(foldersTable).where(eq(foldersTable.id, BigInt(folderId))),
  ]);

  return { success: true };
}

function getAllChildrenFolder(folderId: number) {
  return db
    .select()
    .from(foldersTable)
    .where(eq(foldersTable.parent, BigInt(folderId)));
}

function getAllChildrenFile(folderId: number) {
  return db
    .select()
    .from(filesTable)
    .where(eq(filesTable.parent, BigInt(folderId)));
}

export async function createFolderAction(
  folderId: number,
  formData: FormData,
): Promise<FolderActionResult> {
  "use server";
  const session = await auth();
  if (!session.userId) return { error: "You must be signed in." };

  const result = folderSchema.safeParse({ name: formData.get("name") });
  if (!result.success) {
    return {
      error:
        result.error.flatten().fieldErrors.name?.[0] ?? "Invalid folder name.",
    };
  }

  const newFolder = await MUTATIONS.createFolder(
    { name: result.data.name, parentId: BigInt(folderId) },
    session.userId,
  );
  if (!newFolder)
    return { error: "Something went wrong while creating the folder." };

  return {
    success: {
      folderId: Number(newFolder.id),
      name: result.data.name,
    },
  };
}

export async function editFolderAction(
  folderId: number,
  formData: FormData,
): Promise<FolderActionResult> {
  "use server";
  const session = await auth();
  if (!session.userId) return { error: "You must be signed in." };

  const result = folderSchema.safeParse({ name: formData.get("name") });
  if (!result.success) {
    return {
      error:
        result.error.flatten().fieldErrors.name?.[0] ?? "Invalid folder name.",
    };
  }

  const affectedRows = await MUTATIONS.updateFolder(
    { id: BigInt(folderId), name: result.data.name },
    session.userId,
  );
  if (affectedRows === 0)
    return { error: "Something went wrong while updating the folder." };

  return {
    success: {
      folderId,
      name: result.data.name,
    },
  };
}
