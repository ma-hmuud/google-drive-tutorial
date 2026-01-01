import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { MUTATIONS } from "~/server/db/mutations";
import { QUERIES } from "~/server/db/queries";

export default async function DrivePage() {
  const session = await auth();
  if (!session.userId) {
    return redirect("/sign-in");
  }

  const rootFolder = await QUERIES.getRootFolderForUser(session.userId);
  if (!rootFolder) {
    return (
      <form className="mx-auto" action={async () => {
        "use server";
        const session = await auth();
        if (!session.userId) {
          return redirect("/sign-in");
        }
        const newRootFolder = await MUTATIONS.createRootFolder(session.userId);
        if (!newRootFolder) {
          return redirect("/sign-in");
        }
        return redirect(`/f/${newRootFolder.id}`);
      }}>
        <Button type="submit">Create New Drive</Button>
      </form>
    );
  }

  return redirect(`/f/${rootFolder.id}`);
} 