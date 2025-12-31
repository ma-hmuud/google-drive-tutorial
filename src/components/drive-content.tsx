"use client"

import { Button } from "~/components/ui/button"
import { ChevronRight, Folder as FolderIcon, FileText, ImageIcon, FileArchive, Grid3x3, List, MoreVertical, PlusIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import type { DriveFile, DriveFolder } from "~/types/drive";
import Link from "next/link";

interface DriveContentProps {
  folders: DriveFolder[]
  files: DriveFile[]
}

export function DriveContent({
  folders,
  files,
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

  const handleUpload = () => {
    alert("Upload functionality would be implemented here!")
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 border-b border-border bg-card px-6 py-2">
        <Link href={"/f/1"} className="h-6 px-2 mt-1 text-sm text-foreground">
          My Drive
        </Link>
        {folders.map((folder) => (
          <div key={folder.id} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            <Link href={`/f/${folder.id}`} className="h-6 px-2 mt-1 text-sm text-foreground">
              {folder.name}
            </Link>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <Button onClick={handleUpload} size="icon" className="absolute right-7 bottom-7 bg-primary hover:bg-primary/90 rounded-full">
        <PlusIcon className="h-6 w-6" />
      </Button>

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
            {folders.map((folder) => (folder.id !== BigInt(1) && (
              <Link
                key={folder.id}
                href={`/f/${folder.id}`}
                className="flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 hover:bg-secondary"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getFileIcon(folder.name, "folder")}
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
              </Link>
            )))}
            {/* Files */}
            {files.map((file) => (
              <Link
                key={file.id}
                href={`/f/${file.fileUrl}`}
                className="flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 hover:bg-secondary"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getFileIcon(file.name, "file")}
                  <span className="font-medium text-foreground">{file.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{file.modified}</span>
                <span className="w-20 text-sm text-muted-foreground">{formatFileSize(Number(file.size))}</span>
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
