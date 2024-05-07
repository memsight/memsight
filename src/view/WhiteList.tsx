'use client'
import { toast } from "sonner"
import Dashboard from "./Dashboard"
import { WhiteList as Model } from '@/global'
import WhiteListForm from "@/components/WhiteListForm"
import { useCallback, useState } from "react"
import { useHydrateAtoms } from "jotai/utils"
import { whiteListsAtom, myWhiteListsAtom } from "@/store"
import { useAtom, useAtomValue } from "jotai"
import InfiniteScroll from 'react-infinite-scroller'
import axios from "axios"
import WhiteListItem from "@/components/WhiteListItem"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type AppProps = {
    children: React.ReactNode,
    req_url: string,
    white_lists: Model[],
    my_white_lists: Model[],
}

export default function WhiteList({ children, req_url, white_lists, my_white_lists, ...props }: AppProps) {
    useHydrateAtoms([[whiteListsAtom, white_lists]])
    useHydrateAtoms([[myWhiteListsAtom, my_white_lists]])
    const [whiteLists, setWhiteLists] = useAtom(whiteListsAtom)
    const myWhiteLists = useAtomValue(myWhiteListsAtom)
    const [show, open] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const lastWhiteListId = white_lists.length > 0 ? white_lists[white_lists.length - 1].id : 0
    const [lastId, setLastId] = useState(lastWhiteListId)
    function submit() {
        toast.warning("This is for test only, not implemented.")
    }
    const loadFunc = useCallback(async () => {
        const res = await axios.get('/dashboard/white-list', {
            params: {
                id: lastId
            }
        })
        setWhiteLists([...whiteLists, ...res.data.white_lists])
        if (res.data.white_lists && res.data.white_lists.length > 0) {
            setLastId(res.data.white_lists[res.data.white_lists.length - 1].id)
            setHasMore(true)
        } else {
            setHasMore(false)
        }
    }, [setHasMore, lastId, whiteLists, setWhiteLists])
    const whiteListNodes = whiteLists.map((e) => {
        return <WhiteListItem item={e} key={e.id} />
    })
    const myWhiteListNodes = myWhiteLists.map((e) => {
        return <WhiteListItem item={e} key={'my' + e.id} />
    })
    return <Dashboard url={req_url} {...props}>
        <div className="w-full text-center text-3xl text-gray-600 font-medium">
            <h3>White lists for Memsight rules</h3>
        </div>
        <Tabs defaultValue="community" className="w-full flex flex-col justify-center items-center">
            <TabsList>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="mylist">Created by me</TabsTrigger>
            </TabsList>
            <TabsContent value="community" className="w-full">
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
                    className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 mt-2"
                >
                    {whiteListNodes}
                </InfiniteScroll>
            </TabsContent>
            <TabsContent value="mylist" className="w-full">
                {myWhiteLists.length>0 && <WhiteListForm open={show} setOpen={open} />}
                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {myWhiteLists.length>0 && myWhiteListNodes}
                </div>
                {myWhiteLists.length<=0 && <p className="w-full border border-dashed border-gray-400 flex flex-col justify-center items-center py-16 mt-4 gap-8">
                    <span className="text-gray-500">None of the lists you created were found.</span>
                    <WhiteListForm open={show} setOpen={open} />
                </p>}
            </TabsContent>
        </Tabs>
    </Dashboard>
}