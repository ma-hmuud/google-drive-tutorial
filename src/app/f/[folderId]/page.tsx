import { QUERIES } from "~/server/db/queries";
import type { DriveFile, DriveFolder } from "~/types/drive";
import DriveContents from "./drive-contents";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function FolderPage(props: {
  params: Promise<{ folderId: string }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const [{ search }, { folderId }, session] = await Promise.all([
    props.searchParams,
    props.params,
    auth(),
  ]);

  const parsedFolderId = parseInt(folderId);
  if (isNaN(parsedFolderId) || !session?.userId) {
    return notFound();
  }
  const parsedSearch = search?.trim() ? String(search) : undefined;

  console.log("Search: ", search);

  const [folders, files, parents] = await Promise.all([
    parsedSearch
      ? QUERIES.getFoldersWithSearch(session.userId, parsedSearch)
      : QUERIES.getFolders(BigInt(parsedFolderId)),
    parsedSearch
      ? QUERIES.getFilesWithSearch(session.userId, parsedSearch)
      : QUERIES.getFiles(BigInt(parsedFolderId)),
    QUERIES.getAllParentsForFolder(BigInt(parsedFolderId)),
  ]);

  return (
    <DriveContents
      folders={folders as unknown as DriveFolder[]}
      files={files as unknown as DriveFile[]}
      parents={parents as unknown as DriveFolder[]}
      currentFolderId={parsedFolderId}
    />
  );
}
