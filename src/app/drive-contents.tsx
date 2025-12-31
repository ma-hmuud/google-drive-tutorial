"use client"

import { DriveHeader } from "~/components/drive-header"
import { DriveContent } from "~/components/drive-content"
import type { DriveFolder, DriveFile } from "~/types/drive"
import type { files, folders } from "~/server/db/schema"

export default function DriveContents(props: {
  folders: typeof folders.$inferSelect[]
  files: typeof files.$inferSelect[]
}) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <DriveHeader />
      <div className="flex flex-1 overflow-hidden">
        <DriveContent
          folders={props.folders as DriveFolder[]}
          files={props.files as unknown as DriveFile[]}
        />
      </div>
    </div>
  )
}
