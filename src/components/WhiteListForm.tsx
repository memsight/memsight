'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { useAtom } from 'jotai'
import { whiteListsAtom, myWhiteListsAtom } from "@/store"
import BannerUploader from "./BannerUploader"
import { useCallback } from "react"
import { WhiteList } from "@prisma/client"
import axios from "axios"

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    desc: z.string().min(2, {
        message: 'Description must be at least 2 characters.'
    }),
    banner: z.string().optional(),
    content: z.string().min(2, {
        message: 'Links of the list should not be empty and at least 2 characters.'
    })
})

type WhiteListItem = {
    open: boolean
    setOpen: (open: boolean) => void
    item?: WhiteList
}

export default function WhiteListForm({ open, setOpen, item }: WhiteListItem) {
    const [whiteList, setWhiteList] = useAtom(whiteListsAtom)
    const [myWhiteList, setMyWhiteList] = useAtom(myWhiteListsAtom)
    const whiteListPlaceholder = "Links of your list in regex format, like below: \n" + "https://*.github.io\n" + "https://medium.com/@*/*"
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: item ? item.name : '',
            desc: item ? item.desc : '',
            content: item ? item.content : '',
            banner: item ? item.banner : ''
        },
    })

    const bannerUploaded = useCallback((v: string) => {
        form.setValue('banner', v)
    }, [form])

    function onSubmit(data: z.infer<typeof FormSchema>) {
        axios.post('/api/white-list', data).then((res) => {
            setWhiteList([res.data.item, ...whiteList])
            setMyWhiteList([res.data.item, ...myWhiteList])
            toast.success("New list has been submitted!")
        }).then(() => {
            setOpen(false)
        }).catch((err) => {
            console.error('save white list error', err)
            toast.error("Error occoured when save white list")
        })
    }
    return <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create List
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg md:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create a new list</DialogTitle>
                    <DialogDescription>
                        Enter the name, description and links with regex format to share.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full my-0 space-y-4">
                        <div className="flex flex-col">
                            <div className="flex flex-row gap-2">
                                <div className="flex flex-col space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Name of your list" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This is public display name of this list.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="desc"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Description of your list" {...field} className="resize-none" />
                                                </FormControl>
                                                <FormDescription>
                                                    Description of the list you share with the community.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="space-y-2">
                                        <Label className="block">Banner</Label>
                                        <BannerUploader defaultImage={item?.banner} onUpload={bannerUploaded} />
                                        <FormDescription>
                                            Image is displayed on the whitelist hub.
                                        </FormDescription>
                                    </div>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Links</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder={whiteListPlaceholder} {...field} className="resize-none flex-1" />
                                            </FormControl>
                                            <FormDescription>
                                                Description of the list you share with the community.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-row justify-end mt-8">
                                <Button type="submit">Publish</Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    </>
}