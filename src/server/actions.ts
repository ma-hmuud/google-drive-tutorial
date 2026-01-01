"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { filesTable } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

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
