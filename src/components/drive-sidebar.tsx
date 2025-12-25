import { Home, Clock, Star, Trash2, Cloud } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Progress } from "~/components/ui/progress"
import { cn } from "~/lib/utils"

interface DriveSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function DriveSidebar({ isOpen }: DriveSidebarProps) {
  return (
    <aside
      className={cn(
        "border-r border-border bg-card transition-all duration-300",
        isOpen ? "w-64" : "w-0 overflow-hidden",
      )}
    >
      <div className="flex flex-col gap-2 p-4">
        <Button className="justify-start gap-3 bg-primary hover:bg-primary/90">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New
        </Button>

        <nav className="mt-4 flex flex-col gap-1">
          <Button variant="ghost" className="justify-start gap-3 bg-secondary text-secondary-foreground">
            <Home className="h-5 w-5" />
            My Drive
          </Button>
          <Button variant="ghost" className="justify-start gap-3">
            <Clock className="h-5 w-5" />
            Recent
          </Button>
          <Button variant="ghost" className="justify-start gap-3">
            <Star className="h-5 w-5" />
            Starred
          </Button>
          <Button variant="ghost" className="justify-start gap-3">
            <Trash2 className="h-5 w-5" />
            Trash
          </Button>
        </nav>

        <div className="mt-6 border-t border-border pt-4">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Cloud className="h-5 w-5" />
            <span>Storage</span>
          </Button>
          <div className="mt-2 space-y-2 px-3">
            <Progress value={65} className="h-2" />
            <p className="text-xs text-muted-foreground">6.5 GB of 10 GB used</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
