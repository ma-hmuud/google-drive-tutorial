"use client"

import { DriveHeader } from "~/components/drive-header"
import { DriveContent } from "~/components/drive-content"
import type { DriveFolder, DriveFile } from "~/types/drive"

export default function DriveContents(props: {
  folders: DriveFolder[]
  files: DriveFile[],
  parents: DriveFolder[]
  currentFolderId: number
}) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <DriveHeader />
      <div className="flex flex-1 overflow-hidden">
        <DriveContent
          folders={props.folders}
          files={props.files}
          parents={props.parents}
          currentFolderId={props.currentFolderId}
        />
      </div>
    </div>
  )
}
