'use client'

import { cn } from "@/lib/utils"
import axios from "axios"
import { Plus } from "lucide-react"
import { FormEvent, useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

type UploaderProps = {
    className?: string
    defaultImage?: string
    onUpload?: Function
}

export default function BannerUploader({ className, defaultImage, onUpload }: UploaderProps) {
    const [id, setId] = useState('uploader')
    const [bg, setBg] = useState(defaultImage || '')
    const [uploading, setUploading] = useState(false)
    const uploadFile = useCallback((e: FormEvent) => {
        if (uploading) {
            return
        }
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            const form = new FormData()
            form.append('file', target.files[0])
            setUploading(true)
            axios.post('/api/upload', form).then((res) => {
                if (res.data.length > 0) {
                    setBg(res.data[0].src)
                    if (onUpload) {
                        onUpload(res.data[0].src)
                    }
                } else {
                    toast.error('Upload failed.')
                }
            }).catch(() => {
                toast.error('Upload failed, something wrong.')
            }).finally(() => {
                setUploading(false)
            })
        }
    }, [setBg, setUploading, uploading])
    useEffect(() => {
        setId('uploader' + crypto.randomUUID())
    }, [])
    return <label
        className={cn('flex flex-row justify-center items-center border border-dashed aspect-[16/9] p-8 cursor-pointer text-gray-300 bg-cover bg-center hover:text-gray-500 hover:border-gray-500', className)}
        htmlFor={id}
        style={{
            backgroundImage: bg ? 'url(' + bg + ')' : undefined
        }}
    >
        <input type="file" accept="image/*" id={id} className="hidden" onChange={uploadFile} />
        {!uploading && <Plus size={32} className="w-16 h-16" />}
        {uploading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>}
    </label>
}