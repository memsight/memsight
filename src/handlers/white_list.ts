import { User, WhiteList } from "@/global"
import { whiteLists as Model } from "@/schema/schema"
import { and, desc, eq, lt } from "drizzle-orm"
import { Handler } from "hono"

export const WhiteListHome: Handler = async (c) => {
    const user: User = c.get('user')
    const maxId: string | undefined = c.req.query('id')
    let cursorId = Number.MAX_SAFE_INTEGER
    if (maxId) {
        cursorId = parseInt(maxId)
    }
    const whiteLists = await c.db.query.whiteLists.findMany({
        columns: {
            id: true,
            name: true,
            banner: true,
            desc: true,
            userName: true,
            userAvatar: true
        },
        where: lt(Model.id, cursorId),
        orderBy: [desc(Model.id)],
        limit: 64,
    })
    const myWhiteLists = await c.db.query.whiteLists.findMany({
        columns: {
            id: true,
            name: true,
            banner: true,
            desc: true,
            userName: true,
            userAvatar: true
        },
        where: eq(Model.userId, user.uid),
        orderBy: [desc(Model.id)]
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

export const WhiteListCreate: Handler = async (c) => {
    const user: User = c.get('user')
    const form: WhiteList = await c.req.json()
    const item = await c.db.insert(Model).values({
        userId: user.uid,
        userName: user.name,
        userAvatar: user.avatar,
        name: form.name,
        banner: form.banner,
        desc: form.desc,
        content: form.content,
        createdAt: Date.now(),
    }).returning()
    return c.json({
        item: item[0],
    })
}

export const WhiteListShow: Handler = async (c) => {
    const user: User = c.get('user')
    const widStr: string = c.req.param('wid')
    const whiteList = await c.db.query.whiteLists.findFirst({
        where: eq(Model.id, parseInt(widStr))
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
            editable: user.uid == whiteList.userId
        }
    })
}

export const WhiteListDelete: Handler = async (c) => {
    const user: User = c.get('user')
    const widStr: string = c.req.param('wid')
    const whiteList = await c.db.query.whiteLists.findFirst({
        where: eq(Model.id, parseInt(widStr))
    })
    if (!whiteList) {
        return c.json({
            code: 404,
            message: 'white list not found'
        }, 404)
    }
    await c.db.delete(Model).where(and(eq(Model.id, whiteList.id), eq(Model.userId, user.uid)))
    return c.json({
        code: 0,
        message: "deleted"
    })
}
