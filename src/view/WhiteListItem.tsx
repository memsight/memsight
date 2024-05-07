'use client'
import { Button } from "@/components/ui/button"
import Dashboard from "./Dashboard"
import { WhiteList as Model } from '@/global'
import { Blocks, Trash } from "lucide-react"
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
import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"

type AppProps = {
    children: React.ReactNode,
    req_url: string,
    white_list: Model,
    editable: boolean
}

export default function WhiteListItem({ children, req_url, white_list, editable, ...props }: AppProps) {
    const [found, setFound] = useState(false)
    const [ready, setReady] = useState(false)
    const confirmDelete = useCallback(() => {
        axios.delete('/api/white-list/'+white_list.id).then(() => {
            toast.success('This white list has been deleted.')
            setTimeout(() => {
                document.location.href = '/dashboard/white-list'
            }, 1000);
        })
    }, [white_list])
    const importRule = useCallback(() => {
        window.postMessage({
            source: 'memsight:site',
            type: 'memsight:import',
            whiteList: white_list
        }, '*')
        toast.success('Imported successfully.')
        setFound(true)
    }, [setFound])
    const removeRule = useCallback(() => {
        setFound(false)
        window.postMessage({
            source: 'memsight:site',
            type: 'memsight:remove',
            whiteList: white_list
        }, '*')
        toast.success('Remove this rule successfully.')
    }, [setFound, white_list])
    const msgCb = useCallback((ev:any) => {
        if (ev.data.type === 'memsight:all') {
            const found = ev.data.whiteLists.find((e: Model) => e.id === white_list.id)
            if (found) {
                setFound(true)
            }
            setReady(true)
            console.info('white Lists:', ev.data.whiteLists)
        }
    }, [setReady, setFound, white_list])
    useEffect(() => {
        setTimeout(() => {
            window.postMessage({
                source: 'memsight:site',
                type: 'memsight:current',
                whiteList: white_list
            }, '*')
        }, 500);
        window.addEventListener('message', msgCb)
        return () => {
            window.removeEventListener('message', msgCb)
        }
    }, [ msgCb ])
    return <Dashboard url={req_url} {...props}>
        <div className="w-full flex flex-col justify-center items-center text-center text-3xl text-gray-600 font-medium">
            <div className="md:hidden w-full md:w-1/3 aspect-video overflow-hidden bg-cover bg-center mb-4" style={{
                backgroundImage: 'url('+white_list.banner+')'
            }}>
            </div>
            <h3>{white_list.name}</h3>
            <p className="text-base text-gray-500">{white_list.desc}</p>
            <div className="flex flex-row justify-center gap-4 mt-4">
                {editable && <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="bg-rose-700 hover:bg-rose-900">
                            <Trash size={32} className="w-4 h-4 mr-1" />
                            <span>Delete</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this list
                                and remove from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>}
                {ready && !found && <Button onClick={importRule}>
                    <Blocks size={32} className="w-4 h-4 mr-1" />
                    <span>Import to memsight extension</span>
                </Button>}
                {ready && found && <Button onClick={removeRule}>
                    <Blocks size={32} className="w-4 h-4 mr-1" />
                    <span>Remove from memsight extension</span>
                </Button>}
            </div>
            <div className="w-full flex flex-row justify-center items-start gap-1">
                <div className="w-1/3 md:w-1/6 flex flex-col justify-center items-center my-8 border border-dashed shadow rounded-lg overflow-hidden pb-2">
                    <p className="text-xl bg-white font-light w-full py-2 mb-1">Author</p>
                    <img src={white_list.userAvatar} alt={white_list.userName} className="rounded-full w-12 h-12" />
                    <span className="text-sm text-gray-500">{white_list.userName}</span>
                </div>
                <div className="w-2/3 md:w-1/2 flex flex-col justify-center my-8 border border-dashed pb-2 bg-gray-200 rounded-lg overflow-hidden">
                    <p className="text-xl bg-muted font-light w-full py-2 mb-1">Rule</p>
                    <pre className="text-base font-light text-gray-500 text-left p-4">{white_list.content}</pre>
                </div>
            </div>
        </div>
    </Dashboard>
}