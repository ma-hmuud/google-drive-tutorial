import { redirect } from "next/navigation";
import { QUERIES } from "~/server/db/queries";
import { EditFolderForm } from "./form";

export default async function EditFolderPage(props: {
  params: Promise<{ folderId: string }>
}) {
  const { folderId } = await props.params;

  const parsedFolderId = parseInt(folderId);
  if (isNaN(parsedFolderId)) {
    return redirect("/drive");
  }

  const folder = await QUERIES.getFolderById(BigInt(parsedFolderId));
  if (!folder) {
    return redirect("/drive");
  }

  return <EditFolderForm folderId={parsedFolderId} initialName={folder.name} />;
}

