"use client";

import { Button } from "~/components/ui/button"
import { ChevronRight, Folder as FolderIcon, FileText, ImageIcon, FileArchive, MoreVertical, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import type { DriveFile, DriveFolder } from "~/types/drive";
import Link from "next/link";
import { UploadButton } from "./uploadthing";
import { useRouter } from "next/navigation";
import { deleteFile } from "~/server/actions";

interface DriveContentProps {
  folders: DriveFolder[]
  files: DriveFile[]
  parents: DriveFolder[]
  currentFolderId: number
}

export function DriveContent({
  folders,
  files,
  parents,
  currentFolderId,
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

  const navigation = useRouter();

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 border-b border-border bg-card px-6 py-2">
        {parents.map((folder) => (
          <div key={folder.id} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            <Link href={`/f/${folder.id}`} className="h-6 px-2 mt-1 text-sm text-foreground">
              {folder.parent === null ? "My Drive" : folder.name}
            </Link>
          </div>
        ))}
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
            {folders.map((folder) => (folder.id !== BigInt(currentFolderId) && (
              <Link
                key={folder.id}
                href={`/f/${folder.id}`}
                className="flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 hover:bg-secondary"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getFileIcon(folder.name, "folder")}
                  <span className="font-medium text-foreground">{folder.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{(new Date(folder.modified)).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}</span>
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
                href={file.fileUrl}
                target="_blank"
                className="flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 hover:bg-secondary group"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getFileIcon(file.name, "file")}
                  <span className="font-medium text-foreground">{file.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{(new Date(file.modified)).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}</span>
                <span className="w-20 text-sm text-muted-foreground">{formatFileSize(Number(file.size))}</span>
                <span className="ml-auto flex items-center gap-1">
                  <Button
                    className="cursor-pointer"
                    variant="ghost"
                    aria-label="Delete file"
                    size="icon"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${file.name}"? This action cannot be undone.`
                        )
                      ) {
                        try {
                          await deleteFile(Number(file.id));
                          navigation.refresh();
                        } catch (err) {
                          console.error(err);
                        }
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </span>
              </Link>
            ))}
          </div>
        )}
        <UploadButton className="my-20 mx-auto" endpoint="driveUploader" input={{ folderId: currentFolderId }} onClientUploadComplete={() => {
          navigation.refresh();
        }} />
      </div>
    </main>
  )
}
