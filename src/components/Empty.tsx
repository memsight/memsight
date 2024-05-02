'use client'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Chrome } from "lucide-react"

type AppProps = {
    className?: string,
}

export default function Empty({ className, ...props }: AppProps) {
    return <div {...props} className={cn(
        "flex flex-col justify-center items-center gap-16 bg-white shadow rounded-lg p-16",
        className
      )}>
        <span className="text-gray-400 text-lg">There are no notes found, you could install the browser extension to automatically collect page content when you visit it.</span>
        <a href="https://chromewebstore.google.com/detail/axure-rp-extension-for-ch/dogkpdfcklifaemcdfbildhcofnopogp" target="_blank">
            <Button>
                <Chrome size={24} className="mr-2" />
                <span>Install browser extension</span>
            </Button>
        </a>
    </div>
}