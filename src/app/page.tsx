"use client"

import { useState } from "react"
import { DriveHeader } from "~/components/drive-header"
import { DriveContent } from "~/components/drive-content"
import { mockFolders, mockFiles, folderIds } from "~/lib/mockData"
import type { DriveFolder } from "~/types/drive"

const EMPTY_PATH: DriveFolder[] = []

export default function DrivePage() {
  const [currentPath, setCurrentPath] = useState(EMPTY_PATH)

  const getCurrentContents = () => {
    const lastFolder = currentPath[currentPath.length - 1]
    const currentParentId = lastFolder ? lastFolder.id : folderIds.root

    return {
      folders: mockFolders.filter((folder) => folder.parent === currentParentId),
      files: mockFiles.filter((file) => file.parent === currentParentId),
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
          folders={folders}
          files={files}
          currentPath={currentPath}
          onNavigateToFolder={navigateToFolder}
          onNavigateToRoot={navigateToRoot}
        />
      </div>
    </div>
  )
}
