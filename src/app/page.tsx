import { db } from "~/server/db"
import { files as filesTable, folders as foldersTable } from "~/server/db/schema"
import DriveContents from "./drive-contents";

export default async function DrivePage() {
  const files = await db.select().from(filesTable);
  const folders = await db.select().from(foldersTable);
  return <DriveContents folders={folders} files={files} />
}
