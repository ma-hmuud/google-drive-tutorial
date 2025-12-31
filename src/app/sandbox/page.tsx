import { auth } from "@clerk/nextjs/server";
import { mockFolders } from "~/lib/mockData";
import { db } from "~/server/db";
import { foldersTable } from "~/server/db/schema";

export default function Sandbox() {
    return <form action={async () => {
        "use server";
        const user = await auth();
        if (!user.userId) {
            throw new Error("Unauthorized");
        }

        const rootFolder = await db
            .insert(foldersTable)
            .values({
                name: "Root",
                modified: new Date().toISOString(),
                ownerId: user.userId,
                parent: null
            })
            .$returningId();

        await db.insert(foldersTable).values(mockFolders.map((folder) => {
            return {
                name: folder.name,
                modified: new Date().toISOString(),
                ownerId: user.userId,
                parent: rootFolder[0]?.id,
            }
        }));
    }}>

        <button type="submit">Submit</button>
    </form>
}