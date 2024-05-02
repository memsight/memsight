'use client'

import Dashboard from "./Dashboard"
import { useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { notesAtom } from "@/store"
import { Note as NoteModel } from "@prisma/client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import InfiniteScroll from 'react-infinite-scroller'
import { useCallback, useState } from "react"
import axios from "axios"
import Empty from "@/components/Empty"

type AppProps = {
    children: React.ReactNode
    req_url: string,
    search: string,
    notes?: NoteModel[]
}

export default function Note({ children, req_url, search, ...props }: AppProps) {
    const [hasMore, setHasMore] = useState(true)
    const data:NoteModel[] = props.notes || []
    const lastNoteId = data.length > 0 ? data[data.length - 1].id : 0
    const [lastId, setLastId] = useState(lastNoteId)
    useHydrateAtoms([[notesAtom, data]])
    const [notes, setNotes] = useAtom(notesAtom)
    const noteList = notes.map((n) => {
        return <a href={n.url} target="_blank" className="flex flex-col justify-between bg-white rounded-md cursor-pointer hover:shadow-lg border" key={n.id}>
            <div className="relative">
                {n.image && <div className="w-full bg-cover bg-center aspect-[4/3] rounded-tl-md rounded-tr-md" style={{backgroundImage: 'url('+n.image+')'}}></div>}
                {!n.image && <div className="w-full bg-cover bg-center aspect-[4/3] p-8 rounded-tl-md rounded-tr-md flex flex-row justify-center items-center bg-gradient-to-r from-gray-700 to-black">
                    <span className="text-xl line-clamp-2 bg-clip-text text-transparent bg-gradient-to-l from-slate-500 via-slate-300 to-slate-400">{n.title}</span>
                </div>}
                <p className="absolute left-0 right-0 bottom-0 p-2 text-gray-100 bg-black/30">
                    <span className="line-clamp-1">{n.title}</span>
                </p>
            </div>
            <p className="p-2 flex-1">
                <span className="line-clamp-3">{n.excerpt || n.description}</span>
            </p>
        </a>
    })
    const loadFunc = useCallback(() => {
        if (search) {
            setHasMore(false)
            return
        }
        return axios.get('/dashboard/notes', {
            params: {
                id: lastId
            }
        }).then((res) => {
            setNotes([...notes, ...res.data.notes])
            if (res.data.notes && res.data.notes.length > 0) {
                setLastId(res.data.notes[res.data.notes.length - 1].id)
                setHasMore(true)
            } else {
                setHasMore(false)
            }
        })
    }, [setHasMore, lastId, notes, setNotes, search])
    return <Dashboard url={req_url} {...props}>
        <div className="w-full flex flex-row flex-1 justify-center items-center">
            <form className="w-full md:w-2/3 lg:w-1/2" method="GET" action="/dashboard">
              <div className="relative flex flex-row items-center">
                <Search className="absolute left-3 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Search notes..."
                  defaultValue={search}
                  className="w-full appearance-none bg-background pl-10 py-4 h-auto shadow-none text-xl font-light"
                />
              </div>
            </form>
        </div>
        {notes.length <= 0 && <div className="w-full flex flex-row justify-center">
            <Empty />
        </div>}
        <InfiniteScroll
            pageStart={0}
            loadMore={loadFunc}
            hasMore={hasMore}
            loader={<div className="col-span-full flex flex-row justify-center items-center text-center my-8 text-gray-400" key={0}>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading ...</span>
            </div>}
            className="w-full md:p-8 grid grid-cols-2 md:grid-cols-4 gap-2"
        >
        {noteList}
        </InfiniteScroll>
    </Dashboard>
}