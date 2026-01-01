import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Cloud,
} from "lucide-react";

import { Button } from "~/components/ui/button";

export default async function HomePage() {
  return (
    <>

      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-1 text-sm text-primary">
          <Cloud className="h-4 w-4" />
          MA Drive · Cloud-first collaboration
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
          Easy, secure access to every project, on every device
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Store, share, and collaborate on files with best-in-class security and lightning fast previews. No VPNs, no patches, just work.
        </p>
      </div>

      <section className="rounded-3xl mx-auto mt-16 max-w-2xl border border-border/60 bg-card/70 p-8 text-left shadow-xl shadow-primary/10 backdrop-blur">
        <p className="text-sm font-medium text-primary">Ready when you are</p>
        <h2 className="mt-3 text-3xl font-semibold">Launch your workspace</h2>
        <p className="mt-4 text-muted-foreground">
          We authenticate with Clerk, so your team retains passkeys, MFA, and device trust in a single workflow.
        </p>
        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          action={async () => {
            "use server";
            const session = await auth();
            if (!session.userId) {
              return redirect("/sign-in");
            }
            return redirect("/drive");
          }}
        >
          <Button size="lg" className="h-12 px-8 text-lg">
            Go to Drive <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </section>
    </>
  );
}
