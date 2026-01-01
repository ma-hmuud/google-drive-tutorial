import { SignInButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

export default function SignIn() {
  return (
    <>
      <section className="w-full max-w-md m-auto ">
        <div className="rounded-3xl border border-border/60 bg-card/80 p-8 text-center shadow-2xl shadow-primary/10 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Sign in</p>
          <h2 className="mt-2 text-2xl font-semibold">Open your drive</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Access your files securely with Clerk’s magic links or passkeys.
          </p>
          <div className="mt-8">
            <SignInButton mode="modal" forceRedirectUrl="/drive" signUpForceRedirectUrl={"/drive"}>
              <Button size="lg" className="h-12 w-full px-8 text-base">
                Sign in
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>
    </>
  );
}