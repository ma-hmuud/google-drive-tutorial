"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { filesTable } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { redirect } from "next/navigation";
import { MUTATIONS } from "./db/mutations";
import { folderSchema } from "~/lib/schemas";

const utApi = new UTApi();

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

export async function createFolderAction(folderId: number, formData: FormData) {
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

  redirect(`/f/${newFolder.id}`);
}

export async function editFolderAction(folderId: number, formData: FormData) {
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

  redirect(`/f/${folderId}`);
}
