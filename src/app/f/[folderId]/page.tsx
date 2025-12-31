import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import DriveContents from "~/app/drive-contents";
import { db } from "~/server/db";
import { folders as foldersTable, files as filesTable } from "~/server/db/schema";

export default async function FolderPage(props: {
    params: Promise<{ folderId: string }>
}) {
    const { folderId } = await props.params;

    const parsedFolderId = parseInt(folderId);
    if (isNaN(parsedFolderId)) {
        notFound();
    }

    const folders = await db.select().from(foldersTable).where(eq(foldersTable.parent, BigInt(parsedFolderId)));
    const files = await db.select().from(filesTable).where(eq(filesTable.parent, BigInt(parsedFolderId)));

    return <DriveContents folders={folders} files={files} />;
}