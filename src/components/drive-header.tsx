import { Search } from "lucide-react"
import { Button } from "~/components/ui/button"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import SearchInput from "./search-input"

export function DriveHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-md px-4 py-3">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image src={"/logo.png"} alt="Drive" className="rounded-lg bg-primary shadow-sm" width={34} height={34} />
          <h1 className="text-xl font-medium tracking-tight text-foreground">Drive</h1>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="relative w-full max-w-2xl transition-all focus-within:scale-[1.01]">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <SearchInput />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all">
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-9 w-9 ring-2 ring-border/50 hover:ring-primary/50 transition-all",
              }
            }}
          />
        </SignedIn>
      </div>
    </header>
  )
}
