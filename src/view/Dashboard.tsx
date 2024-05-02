import {
    Home,
    Brain,
    PanelLeft,
    Webhook,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import LogoutForm from "@/components/LogoutForm"

type AppProps = {
    children: React.ReactNode,
    url?: string,
    avatar?: string,
}

export default function Dashboard({ children, url, avatar, ...props }: AppProps) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40" {...props}>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <a
                        href="/dashboard"
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                        <Brain className="h-4 w-4 transition-all group-hover:scale-110" />
                        <span className="sr-only">Memsight</span>
                    </a>
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <a
                                    href="/dashboard"
                                    className={cn("flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8", url === '/dashboard' ? 'bg-accent text-accent-foreground':'text-muted-foreground')}
                                >
                                    <Home className="h-5 w-5" />
                                    <span className="sr-only">Dashboard</span>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent side="right">Dashboard</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <a
                                    href="/dashboard/api/settings"
                                    className={cn("flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8", url === '/dashboard/api/settings' ? 'bg-accent text-accent-foreground':'text-muted-foreground')}
                                >
                                    <Webhook className="h-5 w-5" />
                                    <span className="sr-only">API Settings</span>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent side="right">API Settings</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <a
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                >
                                    <img
                                        src={avatar}
                                        alt="Avatar"
                                        className="overflow-hidden rounded-full w-full h-full"
                                    />
                                    <span className="sr-only">Settings</span>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                    <div className="flex flex-col gap-2">
                                        <div className="cursor-pointer px-2 py-1 rounded hover:bg-gray-100"><a href="https://github.com/memsight/memsight/issues" target="_blank">Support</a></div>
                                        <hr />
                                        <div className="cursor-pointer px-2 py-1 rounded hover:bg-gray-100"><LogoutForm /></div>
                                    </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
            </aside>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header className="sticky top-0 z-30 flex justify-between h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="outline" className="sm:hidden">
                                <PanelLeft className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="sm:max-w-xs">
                            <nav className="grid gap-6 text-lg font-medium">
                                <a
                                    href="#"
                                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                                >
                                    <Brain className="h-5 w-5 transition-all group-hover:scale-110" />
                                    <span className="sr-only">Memsight</span>
                                </a>
                                <a
                                    href="/dashboard"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <Home className="h-5 w-5" />
                                    Dashboard
                                </a>
                                <a
                                    href="/dashboard/api/settings"
                                    className="flex items-center gap-4 px-2.5 text-foreground"
                                >
                                    <Webhook className="h-5 w-5" />
                                    API Settings
                                </a>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="flex sm:hidden overflow-hidden rounded-full"
                            >
                                <img
                                    src={avatar}
                                    width={36}
                                    height={36}
                                    alt="Avatar"
                                    className="overflow-hidden rounded-full"
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel><a href="https://github.com/memsight/memsight/issues" target="_blank">Support</a></DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><LogoutForm /></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="w-full flex flex-col flex-1 justify-start items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4">
                    {children}
                </main>
            </div>
        </div>
    )
}
