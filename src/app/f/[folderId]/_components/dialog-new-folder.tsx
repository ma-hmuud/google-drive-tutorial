"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createFolderAction } from "~/server/actions";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FolderPlus } from "lucide-react";

type FolderFormState = {
  error?: string;
  success?: {
    folderId: number;
    name: string;
  };
};

const initialState: FolderFormState = { error: undefined, success: undefined };

export default function DialogNewFolder({ folderId }: { folderId: number }) {
  const router = useRouter();
  const [state, formAction] = useActionState<FolderFormState, FormData>(
    (_prevState: FolderFormState, formData: FormData) =>
      createFolderAction(folderId, formData),
    initialState,
  );
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (!state.success) return;

    setOpenDialog(false);

    toast.success(`Folder "${state.success.name}" created successfully`, {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    router.push(`/f/${state.success.folderId}`);
  }, [state.success, router]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="bg-secondary hover:bg-secondary/80 h-10 w-full gap-2 text-sm sm:size-auto sm:w-36"
        >
          <FolderPlus className="h-4 w-4" /> New Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <form action={formAction} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Create a new folder</DialogTitle>
            <DialogDescription>
              Give your folder a clear, concise name so it’s easy to spot later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Folder Name</Label>
              <Input
                id="name-1"
                name="name"
                placeholder="ex: Documents"
                autoComplete="off"
              />
            </div>
          </div>
          {state.error && (
            <p className="border-destructive bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm">
              {state.error}
            </p>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create Folder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
