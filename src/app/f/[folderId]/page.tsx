import DriveContents from "~/app/drive-contents";
import { QUERIES } from "~/server/db/queries";
import type { DriveFile, DriveFolder } from "~/types/drive";

export default async function FolderPage(props: {
  params: Promise<{ folderId: string }>
}) {
  const { folderId } = await props.params;

  const parsedFolderId = parseInt(folderId);
  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const [folders, files, parents] = await Promise.all([
    QUERIES.getFolders(BigInt(parsedFolderId)),
    QUERIES.getFiles(BigInt(parsedFolderId)),
    QUERIES.getAllParentsForFolder(BigInt(parsedFolderId))
  ]);

  return <DriveContents folders={folders as unknown as DriveFolder[]} files={files as unknown as DriveFile[]} parents={parents as unknown as DriveFolder[]} currentFolderId={parsedFolderId} />;
}