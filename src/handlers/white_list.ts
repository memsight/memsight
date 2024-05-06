import { User } from "@/global"
import { WhiteList } from "@prisma/client"
import { equal } from "assert"
import { Handler } from "hono"

export const WhiteListHome:Handler = async (c) => {
    const user: User = c.get('user')
    const maxId: string | undefined = c.req.query('id')
    let cursorId = 100000000
    if (maxId) {
        cursorId = parseInt(maxId)
    }
    const idFilter = {
        lt: cursorId
    }
    const whiteLists = await c.prisma.whiteList.findMany({
        select: {
            id: true,
            name: true,
            banner: true,
            desc: true,
            user_name: true,
            user_avatar: true
        },
        where: {
            id: idFilter
        },
        orderBy: {
            id: 'desc'
        },
        take: 64,
    })
    const myWhiteLists = await c.prisma.whiteList.findMany({
        select: {
            id: true,
            name: true,
            banner: true,
            desc: true,
            user_name: true,
            user_avatar: true
        },
        where: {
            user_id: {
                equals: user.uid
            }
        },
        orderBy: {
            id: 'desc'
        }
    })
    if (c.req.header('Accept')?.includes('application/json')) {
        return c.json({
            white_lists: whiteLists,
            my_white_lists: myWhiteLists,
        })
    }
    return c.view('whiteList', {
        meta: {
            title: 'Honojs demo with react SSR and shadcn UI.',
        },
        props: {
            avatar: user.avatar,
            white_lists: whiteLists,
            my_white_lists: myWhiteLists,
        }
    })
}

export const WhiteListCreate:Handler = async (c) => {
    const user: User = c.get('user')
    const form:WhiteList = await c.req.json()
    const item = await c.prisma.whiteList.create({
        data: {
            user_id: user.uid,
            user_name: user.name,
            user_avatar: user.avatar,
            name: form.name,
            desc: form.desc,
            banner: form.banner,
            content: form.content,
            created_at: Date.now(),
        }
    })
    return c.json({
        item,
    })
}

export const WhiteListShow:Handler = async (c) => {
    const user: User = c.get('user')
    const widStr: string = c.req.param('wid')
    const whiteList = await c.prisma.whiteList.findFirst({
        where: {
            id: parseInt(widStr)
        }
    })
    if (!whiteList) {
        return c.notFound()
    }
    return c.view('showWhiteList', {
        meta: {
            title: 'Honojs demo with react SSR and shadcn UI.',
        },
        props: {
            avatar: user.avatar,
            white_list: whiteList,
            editable: user.uid == whiteList?.user_id
        }
    })
}

export const WhiteListDelete:Handler = async (c) => {
    const user: User = c.get('user')
    const widStr: string = c.req.param('wid')
    const whiteList = await c.prisma.whiteList.findFirst({
        where: {
            id: parseInt(widStr)
        }
    })
    if (!whiteList) {
        return c.json({
            code: 404,
            message: 'white list not found'
        }, 404)
    }
    await c.prisma.whiteList.delete({
        where: {
            id: whiteList.id,
            user_id: {
                equals: user.uid
            }
        }
    })
    return c.json({
        code: 0,
        message: "deleted"
    })
}
