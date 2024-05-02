import { Handler } from "hono"
import { sign } from 'hono/jwt'

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
    await c.prisma.token.create({
        data: {
            user_id: user.uid,
            name: body.name,
            secret: secret,
            created_at: Date.now()
        }
    })
    const token = await sign(payload, c.env.API_SECRET, 'HS256')
    return c.json({
        id: Date.now(),
        token: token,
        name: body.name,
        secret: secret,
        created_at: Date.now()
    })
}

export const ListTokens:Handler = async (c) => {
    const user = c.get('user')
    const results = await c.prisma.token.findMany({
        where: {
            user_id: {
                equals: user.uid
            }
        },
        orderBy: {
            id: 'desc',
        },
    })
    return c.json({
        tokens: results,
    })
}

export const DeleteToken:Handler = async (c) => {
    const user = c.get('user')
    const id = parseInt(c.req.param('id'))
    await c.prisma.token.delete({
        where: {
            id: id,
            user_id: {
                equals: user.uid,
            }
        }
    })
    return c.json({
        message: 'Delete successfully'
    })
}

export const ResetToken:Handler = async (c) => {
    const user = c.get('user')
    const id = parseInt(c.req.param('id'))
    const tokenItem = await c.prisma.token.findFirst({
        where: {
            id: id,
            user_id: {
                equals: user.uid,
            }
        }
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
    await c.prisma.token.update({
        where: {
            id,
        },
        data: {
            secret,
        }
    })
    const results = await c.prisma.token.findMany({
        where: {
            user_id: {
                equals: user.uid
            }
        },
        orderBy: {
            id: 'desc',
        },
    })
    const token = await sign(payload, c.env.API_SECRET, 'HS256')
    return c.json({
        tokens: results,
        token,
    })
}

export const ApiSetting:Handler = async (c) => {
    const user = c.get('user')
    const results = await c.prisma.token.findMany({
        where: {
            user_id: {
                equals: user.uid
            }
        },
        orderBy: {
            id: 'desc',
        },
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
