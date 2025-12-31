import { SignInButton, UserButton, SignedOut, SignUpButton, SignedIn } from "@clerk/nextjs"

import { Button } from "~/components/ui/button"

export default async function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <div className="flex items-center gap-2">
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <Button>
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  )
}
