"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { deleteFile, deleteFolder } from "~/server/actions";

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
    const navigation = useRouter();
    const deleteItem = useCallback(async () => {
        try {
            if (itemType === "file") {
                await deleteFile(itemId);
            } else {
                await deleteFolder(itemId);
            }
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
            setOpenDialog(false);
            navigation.refresh();
        } catch (error) {
            toast.error((error as Error).message, {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
        }


    }, [itemType, itemId, itemName, navigation, setOpenDialog]);

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
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={deleteItem}>Delete</Button>
            </DialogFooter>
        </DialogContent>
    )
}