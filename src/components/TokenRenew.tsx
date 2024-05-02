'use client'

import { Button } from "@/components/ui/button"
import { RotateCcw, Copy } from "lucide-react"
import { useSetAtom } from 'jotai'
import { tokensAtom } from "@/store"
import axios from 'axios'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"

import { toast } from "sonner"
import { useState } from "react"
import { useCopyToClipboard } from "usehooks-ts"

type PageProps = {
    className: string,
    id: number
}

export default function TokenRenew({ id, className }: PageProps) {
    const setTokens = useSetAtom(tokensAtom)
    const [open, setOpen] = useState(false)
    const [jwtToken, setJwtToken] = useState('')
    const [, copy] = useCopyToClipboard()
    async function resetToken() {
        const res = await axios.put('/api/tokens/' + id)
        setTokens(res.data.tokens)
        setJwtToken(res.data.token)
        setOpen(true)
    }
    function copyToken() {
        copy(jwtToken).then(() => {
            toast.success('Token copied!')
        })
    }
    return <>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className={className}>
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Once you've done this, there's no going back. Your token will be permanently changed, and any requests you've made with the old token will fail.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetToken}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Copy Token</DialogTitle>
                    <DialogDescription>
                        You should store the token secretly, we will not store this token.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="token" className="sr-only">
                            Token
                        </Label>
                        <Input
                            id="token"
                            defaultValue={jwtToken}
                            readOnly
                        />
                    </div>
                    <Button type="submit" size="sm" className="px-3" onClick={copyToken}>
                        <span className="sr-only">Copy</span>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
}