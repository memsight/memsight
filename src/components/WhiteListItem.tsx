import { cn } from "@/lib/utils";
import { WhiteList } from "@prisma/client";

type WhiteListItemProps = {
    item: WhiteList
}

export default function WhiteListItem({item}: WhiteListItemProps) {
    return <a className="flex flex-col bg-white rounded-lg cursor-pointer" href={'/dashboard/white-list/' + item.id}>
    <div className="w-full aspect-[16/9] rounded-tr-lg rounded-t-lg bg-cover bg-center flex items-end overflow-hidden bg-transparent" style={{
        backgroundImage: item.banner ? 'url('+item.banner+')' : undefined
    }}>
        <p className={cn("w-full bg-black/30 px-2 py-1 text-white text-xl font-light", !item.banner ? 'h-full text-center flex flex-row justify-center items-center' : '')}>{item.name}</p>
    </div>
    <p className="flex-1 p-2 text-gray-500 text-lg flex flex-row justify-center items-center">
        <span className="line-clamp-2 flex-1 text-center">{item.desc}</span>
    </p>
</a>
}