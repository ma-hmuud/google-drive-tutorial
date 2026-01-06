"use client";

import { Button } from "~/components/ui/button";
import {
  ChevronRight,
  Folder as FolderIcon,
  FileText,
  ImageIcon,
  FileArchive,
  MoreVertical,
  Trash2,
  FolderPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { DriveFile, DriveFolder } from "~/types/drive";
import Link from "next/link";
import { UploadButton } from "./uploadthing";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import DialogNewFolder from "~/app/f/[folderId]/_components/dialog-folder";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import DialogDelete from "~/app/f/[folderId]/_components/dialog-delete";

interface DriveContentProps {
  folders: DriveFolder[];
  files: DriveFile[];
  parents: DriveFolder[];
  currentFolderId: number;
}

export function DriveContent({
  folders,
  files,
  parents,
  currentFolderId,
}: DriveContentProps) {
  const getFileIcon = (name: string, type: "file" | "folder") => {
    if (type === "folder") {
      return <FolderIcon className="text-muted-foreground h-5 w-5" />;
    }

    const ext = name.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext ?? "")) {
      return <ImageIcon className="text-muted-foreground h-5 w-5" />;
    }
    if (["zip", "rar", "7z"].includes(ext ?? "")) {
      return <FileArchive className="text-muted-foreground h-5 w-5" />;
    }
    return <FileText className="text-muted-foreground h-5 w-5" />;
  };

  const [openNewFolderDialog, setOpenNewFolderDialog] = useState(false);
  const [editingFolder, setEditingFolder] = useState<{ id: number; name: string } | null>(null);
  const [deleteItem, setDeleteItem] = useState<{ type: "file" | "folder"; id: number; name: string } | null>(null);

  const formatFileSize = (size: number) => {
    if (size <= 0) {
      return "0 B";
    }

    const units = ["B", "KB", "MB", "GB", "TB"];
    let value = size;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    const displayValue =
      value >= 10 || unitIndex === 0
        ? Math.round(value)
        : Number(value.toFixed(1));
    return `${displayValue} ${units[unitIndex]}`;
  };

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
      <div className="border-border bg-card flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {parents.map((folder) => (
            <div key={folder.id} className="flex items-center gap-2">
              <ChevronRight className="text-muted-foreground h-4 w-4" />
              <Link
                href={`/f/${folder.id}`}
                className="text-foreground px-1 text-sm"
              >
                {folder.parent === null ? "My Drive" : folder.name}
              </Link>
            </div>
          ))}
        </div>
        <Dialog open={openNewFolderDialog} onOpenChange={setOpenNewFolderDialog}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="bg-secondary hover:bg-secondary/80 h-10 w-full cursor-pointer gap-2 text-sm sm:size-auto sm:w-36"
            >
              <FolderPlus className="h-4 w-4" /> New Folder
            </Button>
          </DialogTrigger>
          <DialogNewFolder folderId={currentFolderId} setOpenDialog={setOpenNewFolderDialog} />
        </Dialog>
      </div>

      {/* Table Header */}
      <div className="border-border bg-card text-muted-foreground hidden border-b px-6 py-2 text-sm md:block">
        <table className="w-full table-fixed">
          <thead>
            <tr className="text-foreground text-left">
              <th className="w-4/5 py-1 pl-4">Name</th>
              <th className="w-1/10 py-1">Size</th>
              <th className="w-1/10 py-1">Modified</th>
              <th className="w-1/10 py-1">Actions</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 sm:px-6">
        {folders.length === 0 && files.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <FolderIcon className="text-muted-foreground mx-auto h-16 w-16" />
              <p className="text-foreground mt-4 text-lg font-medium">
                This folder is empty
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Upload files or create folders to get started
              </p>
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
                        className="group hover:bg-secondary rounded-lg transition"
                      >
                        <td className="px-3 py-2 align-middle">
                          <Link
                            href={`/f/${folder.id}`}
                            className="flex items-center gap-3"
                          >
                            {getFileIcon(folder.name, "folder")}
                            <span className="text-foreground font-medium">
                              {folder.name}
                            </span>
                          </Link>
                        </td>
                        <td className="text-muted-foreground w-1/10 px-14 py-2 align-middle">
                          —
                        </td>
                        <td className="text-muted-foreground w-1/10 px-7 py-2 align-middle text-sm">
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
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setEditingFolder({ id: Number(folder.id), name: folder.name });
                                }}
                              >
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDeleteItem({ type: "folder", id: Number(folder.id), name: folder.name });
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ),
                )}
                {/* Files */}
                {files.map((file) => (
                  <tr
                    key={file.id}
                    className="group hover:bg-secondary rounded-lg transition"
                  >
                    <td className="px-3 py-2 align-middle">
                      <Link
                        href={file.fileUrl}
                        target="_blank"
                        className="flex items-center gap-3"
                      >
                        {getFileIcon(file.name, "file")}
                        <span className="text-foreground font-medium">
                          {file.name}
                        </span>
                      </Link>
                    </td>
                    <td className="text-muted-foreground w-1/10 px-12 py-2 align-middle text-sm">
                      {formatFileSize(Number(file.size))}
                    </td>
                    <td className="text-muted-foreground w-1/10 px-7 py-2 align-middle text-sm">
                      {formatModifiedDate(file.modified)}
                    </td>
                    <td className="w-1/10 px-5 py-2 align-middle">
                      <Button
                        className="cursor-pointer"
                        variant="ghost"
                        aria-label="Delete file"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteItem({ type: "file", id: Number(file.id), name: file.name });
                        }}
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile View */}
            <div className="space-y-3 md:hidden">
              {/* Folders */}
              {folders.map(
                (folder) =>
                  folder.id !== BigInt(currentFolderId) && (
                    <div
                      key={folder.id}
                      className="border-border bg-card rounded-lg border p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/f/${folder.id}`}
                          className="flex flex-1 items-center gap-3"
                        >
                          {getFileIcon(folder.name, "folder")}
                          <span className="text-foreground text-base font-medium">
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
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setEditingFolder({ id: Number(folder.id), name: folder.name });
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeleteItem({ type: "folder", id: Number(folder.id), name: folder.name });
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-3 text-xs">
                        <span>Folder</span>
                        <span className="bg-muted-foreground/60 h-1 w-1 rounded-full" />
                        <span>
                          Modified {formatModifiedDate(folder.modified)}
                        </span>
                      </div>
                    </div>
                  ),
              )}

              {/* Files */}
              {files.map((file) => (
                <div
                  key={file.id}
                  className="border-border bg-card rounded-lg border p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={file.fileUrl}
                      target="_blank"
                      className="flex flex-1 items-center gap-3"
                    >
                      {getFileIcon(file.name, "file")}
                      <span className="text-foreground truncate text-base font-medium">
                        {file.name}
                      </span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete file"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteItem({ type: "file", id: Number(file.id), name: file.name });
                      }}
                    >
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-3 text-xs">
                    <span>{formatFileSize(Number(file.size))}</span>
                    <span className="bg-muted-foreground/60 h-1 w-1 rounded-full" />
                    <span>Modified {formatModifiedDate(file.modified)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Upload Button - Fixed Position */}
      <div className="absolute bottom-6 left-1/2 z-10 w-full max-w-sm -translate-x-1/2 px-4">
        <UploadButton
          className="w-full"
          endpoint="driveUploader"
          input={{ folderId: currentFolderId }}
          onClientUploadComplete={() => {
            navigation.refresh();
            toast.success(`File uploaded successfully`, {
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          }}
        />
      </div>

      {/* Edit Folder Dialog */}
      <Dialog open={!!editingFolder} onOpenChange={(open) => !open && setEditingFolder(null)}>
        {editingFolder && (
          <DialogNewFolder
            folderId={currentFolderId}
            editFolderId={editingFolder.id}
            initName={editingFolder.name}
            setOpenDialog={(open) => !open && setEditingFolder(null)}
          />
        )}
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        {deleteItem && (
          <DialogDelete itemType={deleteItem.type} itemId={deleteItem.id} itemName={deleteItem.name} setOpenDialog={(open) => !open && setDeleteItem(null)} />
        )}
      </Dialog>
    </main>
  );
}
