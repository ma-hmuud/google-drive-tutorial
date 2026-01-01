"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { createFolderAction } from "~/server/actions";

type FolderFormState = {
  error?: string;
  success?: {
    folderId: number;
    name: string;
  };
};

const initialState: FolderFormState = { error: undefined, success: undefined };

export function NewFolderForm({ folderId }: { folderId: number }) {
  const router = useRouter();
  const [state, formAction] = useFormState<FolderFormState, FormData>(
    (_prevState: FolderFormState, formData: FormData) =>
      createFolderAction(folderId, formData),
    initialState,
  );

  useEffect(() => {
    if (!state.success) return;

    toast.success(`Folder "${state.success.name}" created successfully`, {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    router.push(`/f/${state.success.folderId}`);
  }, [state.success, router]);

  return (
    <form
      action={formAction}
      className="mx-auto mt-8 w-full max-w-md rounded-xl border border-border bg-secondary p-6 shadow-sm"
    >
      <div className="flex flex-col gap-5">
        <header className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Create a new folder</h2>
          <p className="text-sm text-muted-foreground">
            Give your folder a clear, concise name so it’s easy to spot later.
          </p>
        </header>

        <div className="space-y-2">
          <label htmlFor="folder-name" className="text-sm font-medium text-foreground">
            Folder name
          </label>
          <Input
            id="folder-name"
            name="name"
            placeholder="e.g. Work Projects"
            required
            autoComplete="off"
            className="h-11 border-border text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
          />
        </div>

        {state.error && (
          <p className="rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}

        <Button type="submit" className="h-11 justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Create Folder
        </Button>
      </div>
    </form>
  );
}