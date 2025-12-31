"use client"

import { useState } from "react"
import { DriveHeader } from "~/components/drive-header"
import { DriveContent } from "~/components/drive-content"
import type { DriveFolder, DriveFile } from "~/types/drive"
import type { files, folders } from "~/server/db/schema"

const EMPTY_PATH: DriveFolder[] = []

export default function DriveContents(props: {
  folders: typeof folders.$inferSelect[]
  files: typeof files.$inferSelect[]
}) {
  const [currentPath, setCurrentPath] = useState(EMPTY_PATH)

  const getCurrentContents = () => {
    const lastFolder = currentPath[currentPath.length - 1]
    const currentParentId = lastFolder ? BigInt(lastFolder.id) : BigInt(1)

    return {
      folders: props.folders.filter((folder) => folder.parent === currentParentId),
      files: props.files.filter((file) => BigInt(file.parent) === currentParentId),
    }
  }

  const { folders, files } = getCurrentContents()

  const navigateToFolder = (folder: DriveFolder) => {
    if (currentPath.find((pathItem) => pathItem.id === folder.id)) {
      setCurrentPath(currentPath.slice(0, currentPath.indexOf(folder) + 1))
    } else {
      setCurrentPath([...currentPath, folder])
    }
  }

  const navigateToRoot = () => {
    setCurrentPath([])
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <DriveHeader />
      <div className="flex flex-1 overflow-hidden">
        <DriveContent
          folders={folders as DriveFolder[]}
          files={files as unknown as DriveFile[]}
          currentPath={currentPath}
          onNavigateToFolder={navigateToFolder}
          onNavigateToRoot={navigateToRoot}
        />
      </div>
    </div>
  )
}
