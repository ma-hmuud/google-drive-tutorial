"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { deleteFile, deleteFolder } from "~/server/actions";

function DeleteButton({ isLoading, onDelete }: { isLoading: boolean; onDelete: () => void }) {
  return (
    <Button variant="destructive" className="cursor-pointer hover:bg-destructive/90" disabled={isLoading} onClick={onDelete}>
      {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
    </Button>
  );
}

export default function DialogDelete({
  itemType,
  itemId,
  itemName,
  setOpenDialog,
}: {
  itemType: "file" | "folder";
  itemId: number;
  itemName: string;
  setOpenDialog: (open: boolean) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();

  const isLoading = isDeleting || isTransitioning;

  const handleDelete = async () => {
    if (isLoading) return; // Prevent multiple clicks

    setIsDeleting(true);
    try {
      if (itemType === "file") {
        await deleteFile(itemId);
      } else {
        await deleteFolder(itemId);
      }

      setOpenDialog(false);

      toast.success(
        `"${itemName}" deleted successfully`,
        {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        },
      );

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      toast.error((error as Error).message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setIsDeleting(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete {`"${itemName}"`}</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        Are you sure you want to delete <span className="font-bold">{`"${itemName}"`}</span>? This action cannot be undone.
      </DialogDescription>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" disabled={isLoading}>Cancel</Button>
        </DialogClose>
        <DeleteButton isLoading={isLoading} onDelete={handleDelete} />
      </DialogFooter>
    </DialogContent>
  );
}