"use client";

import { Button } from "~/components/ui/button"
import { ChevronRight, Folder as FolderIcon, FileText, ImageIcon, FileArchive, MoreVertical, Trash2, FolderPlus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import type { DriveFile, DriveFolder } from "~/types/drive";
import Link from "next/link";
import { UploadButton } from "./uploadthing";
import { useRouter } from "next/navigation";
import { deleteFile, deleteFolder } from "~/server/actions";
import { toast } from "react-hot-toast";

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
  const formatModifiedDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {parents.map((folder) => (
            <div key={folder.id} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link href={`/f/${folder.id}`} className="px-1 text-sm text-foreground">
                {folder.parent === null ? "My Drive" : folder.name}
              </Link>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-full gap-2 bg-secondary text-sm hover:bg-secondary/80 sm:w-36 sm:size-auto"
          onClick={() => {
            navigation.push(`/f/${currentFolderId}/new-folder`);
          }}
        >
          <FolderPlus className="h-4 w-4" /> New Folder
        </Button>
      </div>

      {/* Table Header */}
      <div className="hidden border-b border-border bg-card px-6 py-2 text-sm text-muted-foreground md:block">
        <table className="w-full table-fixed">
          <thead>
            <tr className="text-left text-foreground">
              <th className="w-4/5 py-1 pl-4">Name</th>
              <th className="w-1/10 py-1">Size</th>
              <th className="w-1/10 py-1">Modified</th>
              <th className="w-1/10 py-1">Actions</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Content Area */}
      <div className="px-4 py-4 sm:px-6">
        {folders.length === 0 && files.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <FolderIcon className="mx-auto h-16 w-16 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium text-foreground">This folder is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Upload files or create folders to get started</p>
            </div>
          </div>
        ) : (
          <>
            <table className="hidden w-full table-fixed md:table">
              <tbody>
                {/* Folders */}
                {folders.map(
                  (folder) =>
                    folder.id !== BigInt(currentFolderId) && (
                      <tr
                        key={folder.id}
                        className="group rounded-lg transition hover:bg-secondary"
                      >
                        <td className="px-3 py-2 align-middle">
                          <Link
                            href={`/f/${folder.id}`}
                            className="flex items-center gap-3"
                          >
                            {getFileIcon(folder.name, "folder")}
                            <span className="font-medium text-foreground">{folder.name}</span>
                          </Link>
                        </td>
                        <td className="w-1/10 px-14 py-2 align-middle text-muted-foreground">—</td>
                        <td className="w-1/10 px-7 py-2 align-middle text-sm text-muted-foreground">
                          {formatModifiedDate(folder.modified)}
                        </td>
                        <td className="w-1/10 px-5 py-2 align-middle">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                navigation.push(`/f/${folder.id}/edit-folder`);
                              }}>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (
                                  window.confirm(
                                    `Are you sure you want to delete "${folder.name}"? This action cannot be undone.`
                                  )
                                ) {
                                  try {
                                    await deleteFolder(Number(folder.id));
                                    toast.success(`"${folder.name}" deleted successfully`, {
                                      style: {
                                        borderRadius: '10px',
                                        background: '#333',
                                        color: '#fff',
                                      },
                                    });
                                    navigation.refresh();
                                  } catch (err) {
                                    toast.error("Failed to delete folder", {
                                      style: {
                                        borderRadius: '10px',
                                        background: '#333',
                                        color: '#fff'
                                      }
                                    });
                                    console.error(err);
                                  }
                                }
                              }}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    )
                )}
                {/* Files */}
                {files.map((file) => (
                  <tr
                    key={file.id}
                    className="group rounded-lg transition hover:bg-secondary"
                  >
                    <td className="px-3 py-2 align-middle">
                      <Link
                        href={file.fileUrl}
                        target="_blank"
                        className="flex items-center gap-3"
                      >
                        {getFileIcon(file.name, "file")}
                        <span className="font-medium text-foreground">{file.name}</span>
                      </Link>
                    </td>
                    <td className="w-1/10 px-12 py-2 align-middle text-sm text-muted-foreground">
                      {formatFileSize(Number(file.size))}
                    </td>
                    <td className="w-1/10 px-7 py-2 align-middle text-sm text-muted-foreground">
                      {formatModifiedDate(file.modified)}
                    </td>
                    <td className="w-1/10 px-5 py-2 align-middle">
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
                              toast.success(`"${file.name}" deleted successfully`, {
                                style: {
                                  borderRadius: '10px',
                                  background: '#333',
                                  color: '#fff'
                                }
                              });
                            } catch (err) {
                              toast.error("Failed to delete file", {
                                style: {
                                  borderRadius: '10px',
                                  background: '#333',
                                  color: '#fff'
                                }
                              });
                              console.error(err);
                            }
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="space-y-3 md:hidden">
              {folders.map(
                (folder) =>
                  folder.id !== BigInt(currentFolderId) && (
                    <div
                      key={folder.id}
                      className="rounded-lg border border-border bg-card p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Link href={`/f/${folder.id}`} className="flex flex-1 items-center gap-3">
                          {getFileIcon(folder.name, "folder")}
                          <span className="text-base font-medium text-foreground">
                            {folder.name}
                          </span>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={() => navigation.push(`/f/${folder.id}/edit-folder`)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (
                                window.confirm(
                                  `Are you sure you want to delete "${folder.name}"? This action cannot be undone.`
                                )
                              ) {
                                try {
                                  await deleteFolder(Number(folder.id));
                                  toast.success(`"${folder.name}" deleted successfully`, {
                                    style: {
                                      borderRadius: '10px',
                                      background: '#333',
                                      color: '#fff',
                                    },
                                  });
                                  navigation.refresh();
                                } catch (err) {
                                  toast.error("Failed to delete folder", {
                                    style: {
                                      borderRadius: '10px',
                                      background: '#333',
                                      color: '#fff'
                                    }
                                  });
                                  console.error(err);
                                }
                              }
                            }}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>Folder</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                        <span>Modified {formatModifiedDate(folder.modified)}</span>
                      </div>
                    </div>
                  )
              )}

              {files.map((file) => (
                <div
                  key={file.id}
                  className="rounded-lg border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={file.fileUrl}
                      target="_blank"
                      className="flex flex-1 items-center gap-3"
                    >
                      {getFileIcon(file.name, "file")}
                      <span className="text-base font-medium text-foreground truncate">
                        {file.name}
                      </span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete file"
                      className="h-8 w-8"
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
                            toast.success(`"${file.name}" deleted successfully`, {
                              style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff'
                              }
                            });
                          } catch (err) {
                            toast.error("Failed to delete file", {
                              style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff'
                              }
                            });
                            console.error(err);
                          }
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatFileSize(Number(file.size))}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                    <span>Modified {formatModifiedDate(file.modified)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <UploadButton
          className="my-10 mx-auto w-full max-w-sm"
          endpoint="driveUploader"
          input={{ folderId: currentFolderId }}
          onClientUploadComplete={() => {
            navigation.refresh();
            toast.success(`File uploaded successfully`, {
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            });
          }}
        />
      </div>
    </main>
  )
}
