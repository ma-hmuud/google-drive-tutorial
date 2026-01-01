import { SignInButton } from "@clerk/nextjs";
import { Cloud, Lock, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "~/components/ui/button";

const highlights = [
    {
        icon: ShieldCheck,
        title: "Precision security",
        description: "Zero-knowledge encryption and continuous monitoring keep your files safe.",
    },
    {
        icon: Lock,
        title: "Advanced access",
        description: "Granular roles and approvals make collaboration controlled and fast.",
    },
    {
        icon: Sparkles,
        title: "AI summaries",
        description: "Turn long PDFs into key takeaways you can action in seconds.",
    },
];

export default function SignIn() {
    return (
        <>
            <main className="mx-auto flex w-full flex-1 max-w-6xl flex-col px-6 py-16 md:flex-row md:items-center md:gap-16">
                <section className="w-full max-w-md mx-auto">
                    <div className="rounded-3xl border border-border/60 bg-card/80 p-8 text-center shadow-2xl shadow-primary/10 backdrop-blur">
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Sign in</p>
                        <h2 className="mt-2 text-2xl font-semibold">Open your drive</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Access your files securely with Clerk’s magic links or passkeys.
                        </p>
                        <div className="mt-8">
                            <SignInButton mode="modal" forceRedirectUrl="/drive">
                                <Button size="lg" className="h-12 w-full px-8 text-base">
                                    Sign in
                                </Button>
                            </SignInButton>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}