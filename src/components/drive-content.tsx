"use client"

import type { DriveFile, DriveFolder } from "~/types/drive"
import { Button } from "~/components/ui/button"
import { ChevronRight, Folder as FolderIcon, FileText, ImageIcon, FileArchive, Grid3x3, List, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"

interface DriveContentProps {
  folders: DriveFolder[]
  files: DriveFile[]
  currentPath: DriveFolder[]
  onNavigateToFolder: (folder: DriveFolder) => void
  onNavigateToRoot: () => void
}

export function DriveContent({
  folders,
  files,
  currentPath,
  onNavigateToFolder,
  onNavigateToRoot,
}: DriveContentProps) {
  const getFileIcon = (name: string, type: "file" | "folder") => {
    if (type === "folder") {
      return <FolderIcon className="h-5 w-5 text-muted-foreground" />
    }

    const ext = name.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext ?? "")) {
      return <ImageIcon className="h-5 w-5 text-muted-foreground" />
    }
    if (["zip", "rar", "7z"].includes(ext ?? "")) {
      return <FileArchive className="h-5 w-5 text-muted-foreground" />
    }
    return <FileText className="h-5 w-5 text-muted-foreground" />
  }

  const formatFileSize = (size: number) => {
    if (size <= 0) {
      return "0 B"
    }

    const units = ["B", "KB", "MB", "GB", "TB"]
    let value = size
    let unitIndex = 0

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024
      unitIndex++
    }

    const displayValue = value >= 10 || unitIndex === 0 ? Math.round(value) : Number(value.toFixed(1))
    return `${displayValue} ${units[unitIndex]}`
  }

  const handleFolderClick = (folder: DriveFolder) => {
    onNavigateToFolder(folder)
  }

  const handleFileClick = (file: DriveFile) => {
    if (file.fileUrl) {
      window.open(file.fileUrl, "_blank")
    }
  }

  const handleUpload = () => {
    alert("Upload functionality would be implemented here!")
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 border-b border-border bg-card px-6 py-3">
        <Button variant="ghost" size="sm" onClick={onNavigateToRoot} className="h-8 px-2 text-sm hover:bg-secondary">
          My Drive
        </Button>
        {currentPath.map((pathItem) => (
          <div key={pathItem.id} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Button variant="ghost" size="sm" className="h-8 px-2 text-sm hover:bg-secondary" onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              if (pathItem.id !== currentPath[currentPath.length - 1]!.id) {
                currentPath.slice(0, currentPath.indexOf(pathItem))
                onNavigateToFolder(pathItem)
              }
            }}>
              {pathItem.name}
            </Button>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Grid3x3 className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleUpload} size="sm" className="bg-primary hover:bg-primary/90">
          Upload
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {folders.length === 0 && files.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <FolderIcon className="mx-auto h-16 w-16 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium text-foreground">This folder is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Upload files or create folders to get started</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Folders */}
            {folders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => handleFolderClick(folder)}
                className="flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 hover:bg-secondary"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getFileIcon(folder.name, folder.type)}
                  <span className="font-medium text-foreground">{folder.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{folder.modified}</span>
                <span className="w-20 text-sm text-muted-foreground">—</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Open</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}

            {/* Files */}
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => handleFileClick(file)}
                className="flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 hover:bg-secondary"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getFileIcon(file.name, file.type)}
                  <span className="font-medium text-foreground">{file.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{file.modified}</span>
                <span className="w-20 text-sm text-muted-foreground">{formatFileSize(file.size)}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Open</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
