import { Handler } from "hono"
import { sign } from 'hono/jwt'
import { tokens as Model } from '../schema/schema'
import { and, desc, eq } from "drizzle-orm"

export const Home:Handler = (c) => {
    const user = c.get('user')
    return c.view('hello', {
        meta: {
            title: 'Honojs demo with react SSR and shadcn UI.',
        },
        props: {
            avatar: user ? user.avatar : '',
        }
    })
}

export const CreateToken:Handler = async (c) => {
    const user = c.get('user')
    const body = await c.req.json()
    const secret = crypto.randomUUID()
    const payload = {
        uid: user.uid,
        iss: 'memsight',
        sub: body.name,
        secret: secret,
    }
    await c.db.insert(Model).values({
        userId: user.uid,
        name: body.name,
        secret: secret,
        createdAt: Date.now()
    })
    const token = await sign(payload, c.env.API_SECRET, 'HS256')
    return c.json({
        id: Date.now(),
        token: token,
        name: body.name,
        secret: secret,
        createdAt: Date.now()
    })
}

export const ListTokens:Handler = async (c) => {
    const user = c.get('user')
    const results = await c.db.query.tokens.findMany({
        where: eq(Model.userId, user.uid),
        orderBy: [desc(Model.id)],
    })
    return c.json({
        tokens: results,
    })
}

export const DeleteToken:Handler = async (c) => {
    const user = c.get('user')
    const id = parseInt(c.req.param('id'))
    await c.db.delete(Model).where(and(eq(Model.id, id), eq(Model.userId, user.uid)))
    return c.json({
        message: 'Delete successfully'
    })
}

export const ResetToken:Handler = async (c) => {
    const user = c.get('user')
    const id = parseInt(c.req.param('id'))
    const tokenItem = await c.db.query.tokens.findFirst({
        where: and(eq(Model.id, id), eq(Model.userId, user.uid))
    })
    if (!tokenItem) {
        return c.json({
            message: 'Token not found'
        }, 404)
    }
    const secret = crypto.randomUUID()
    const payload = {
        uid: user.uid,
        iss: 'memsight',
        sub: tokenItem.name,
        secret: secret,
    }
    await c.db.update(Model).set({secret}).where(eq(Model.id, id))
    const results = await c.db.query.tokens.findMany({
        where: eq(Model.userId, user.uid),
        orderBy: [desc(Model.id)],
    })
    const token = await sign(payload, c.env.API_SECRET, 'HS256')
    return c.json({
        tokens: results,
        token,
    })
}

export const ApiSetting:Handler = async (c) => {
    const user = c.get('user')
    const results = await c.db.query.tokens.findMany({
        where: eq(Model.userId, user.uid),
        orderBy: [desc(Model.id)],
    })
    return c.view('apiSetting', {
        meta: {
            title: 'Honojs demo with react SSR and shadcn UI.',
        },
        props: {
            avatar: user.avatar,
            tokens: results,
        }
    })
}
