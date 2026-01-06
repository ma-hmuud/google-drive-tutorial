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
import { useActionState, useEffect, useTransition } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

type FolderFormState = {
  error?: string;
  success?: {
    folderId: number;
    name: string;
  };
};

const initialState: FolderFormState = { error: undefined, success: undefined };

function SubmitButton({ initName, isTransitioning }: { initName?: string; isTransitioning: boolean }) {
  const { pending } = useFormStatus();
  const isLoading = pending || isTransitioning;

  return (
    <Button type="submit" disabled={isLoading}>
      {isLoading ? <Loader2 className="size-4 animate-spin" /> : initName ? "Save Changes" : "Create Folder"}
    </Button>
  );
}

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
  const [isTransitioning, startTransition] = useTransition();

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

    startTransition(() => {
      router.refresh();
    });
  }, [state.success, router, initName, setOpenDialog]);

  return (
    <DialogContent className="sm:max-w-106.25">
      <form action={formAction} className="grid gap-6">
        <DialogHeader>
          <DialogTitle>
            {initName ? "Edit Folder" : "Create a new folder"}
          </DialogTitle>
          <DialogDescription>
            Give your folder a clear, concise name so it&apos;s easy to spot later.
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
              disabled={isTransitioning}
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
            <Button variant="outline" disabled={isTransitioning}>Cancel</Button>
          </DialogClose>
          <SubmitButton initName={initName} isTransitioning={isTransitioning} />
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
