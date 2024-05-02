'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Plus, Copy } from "lucide-react"
import { useAtom } from 'jotai'
import { tokensAtom } from "@/store"
import { Token } from "@/global"
import { useState } from "react"
import axios from 'axios'
import { useCopyToClipboard } from 'usehooks-ts'
import { toast } from "sonner"

export default function TokenForm() {
    const [tokens, setTokens] = useAtom(tokensAtom)
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [jwtToken, setJwtToken] = useState('')
    const [,copy] = useCopyToClipboard()
    async function submit() {
        const token: Token = {
            id: Date.now(),
            name: name,
            secret: 'secret'
        }
        const res = await axios.post('/api/tokens', token)
        setTokens([res.data, ...tokens])
        setJwtToken(res.data.token)
        setOpen(true)
    }
    function change(e: any) {
        setName(e.target.value)
    }
    function copyToken() {
        copy(jwtToken).then(() => {
            toast.success('Token copied!')
        })
    }
    return <>
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new token</DialogTitle>
                    <DialogDescription>
                        Enter a name to indicate where you are using this token.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            defaultValue=""
                            placeholder="My Token"
                            className="col-span-3"
                            onChange={change}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="submit" onClick={submit}>Save token</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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