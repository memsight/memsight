'use client'

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
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

import { toast } from "sonner"

type PageProps = {
    id: number
}

export default function TokenDelete({id}: PageProps) {
    const setTokens = useSetAtom(tokensAtom)
    async function deleteToken() {
        await axios.delete('/api/tokens/'+id)
        const res = await axios.get('/api/tokens')
        setTokens(res.data.tokens)
        toast.warning('Just to let you know, the token has been deleted.')
    }
    return <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon">
                <Trash className="h-4 w-4" />
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                Once you've done this, there's no going back. Your token will be permanently deleted, and any requests you've made with it will fail.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteToken}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}