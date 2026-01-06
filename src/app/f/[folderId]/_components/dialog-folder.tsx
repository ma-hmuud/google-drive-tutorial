"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createFolderAction, editFolderAction } from "~/server/actions";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

type FolderFormState = {
  error?: string;
  success?: {
    folderId: number;
    name: string;
  };
};

const initialState: FolderFormState = { error: undefined, success: undefined };

export default function DialogFolder({
  folderId,
  initName,
  setOpenDialog,
  editFolderId
}: {
  folderId: number;
  initName?: string;
  setOpenDialog: (open: boolean) => void;
  editFolderId?: number;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState<FolderFormState, FormData>(
    (_prevState: FolderFormState, formData: FormData) =>
      initName && editFolderId
        ? editFolderAction(editFolderId, formData)
        : createFolderAction(folderId, formData),
    initialState,
  );

  useEffect(() => {
    if (!state.success) return;

    setOpenDialog(false);

    toast.success(
      `Folder "${state.success.name}" ${initName ? "updated" : "created"} successfully`,
      {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      },
    );
    router.refresh();
  }, [state.success, router, initName, setOpenDialog]);

  return (
    <DialogContent className="sm:max-w-106.25">
      <form action={formAction} className="grid gap-6">
        <DialogHeader>
          <DialogTitle>
            {initName ? "Edit Folder" : "Create a new folder"}
          </DialogTitle>
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
              defaultValue={initName}
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
          <Button type="submit">
            {initName ? "Save Changes" : "Create Folder"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
