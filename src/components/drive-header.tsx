import { Search, Menu } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

export function DriveHeader() {
  return (
    <header className="flex items-center gap-4 border-b border-border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <Image src={"/logo.png"} alt="Drive" className="rounded bg-primary" width={32} height={32} />
          <h1 className="text-xl font-medium text-foreground">Drive</h1>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search in Drive" className="w-full bg-secondary pl-10" />
        </div>
      </div>

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
    </header>
  )
}
