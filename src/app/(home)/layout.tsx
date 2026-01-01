export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
            <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-16 pt-24">
                {children}
            </main>
            <footer className="my-10 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} MA Drive. All rights reserved.
            </footer>
        </div>
    );
}