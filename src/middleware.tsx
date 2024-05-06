import { User, ViewData } from "./global"
import { getViewByName } from "./renderer"
import manifest from './lib/manifest.json'
import { getCookie } from "hono/cookie"
import { verify } from 'hono/jwt'
import { createMiddleware } from "hono/factory"
import { PrismaClient, Token } from "@prisma/client/edge"
import { PrismaD1 } from '@prisma/adapter-d1'

let prismaCli: PrismaClient | undefined

export const ViewRenderer = createMiddleware(async (c, next) => {
    c.view = (name: string, view: ViewData) => {
        const Comp = getViewByName(name)
        view.name = name
        view.meta.manifest = manifest
        view.props.req_url = c.req.path
        return c.render(<Comp {...view.props} />, { view, manifest })
    }
    await next()
})

export const Prisma = createMiddleware(async (c, next) => {
    const adapter = new PrismaD1(c.env.DB)
    if (!prismaCli) {
        prismaCli = new PrismaClient({ adapter })
        console.info('init prisma client')
    }
    c.prisma = prismaCli
    await next()
})

export const SimpleAuth = createMiddleware(async (c, next) => {
    let authToken = c.req.header('Authorization')?.replaceAll('Bearer ', '')
    if (!authToken) {
        authToken = getCookie(c, 'auth-token')
    }
    if (!authToken) {
        return c.json({
            status: 401,
            message: 'You must be logged in to access these resources.'
        }, 401)
    }
    // validate the auth token
    try {
        const user:User = await verify(authToken, c.env.AUTH_KEY)
        c.set('user', user)
    } catch (error) {
        console.error(error)
        const accept = c.req.header('Accept')
        if (accept?.includes('application/json')) {
            return c.json({
                status: 401,
                message: 'You must be logged in to access these resources.'
            }, 401)
        } else {
            return c.redirect(c.env.LOGIN_URL + '?redirect=' + c.req.url)
        }
    }
    await next()
})

export const ApiAuth = createMiddleware(async (c, next) => {
    let authToken = c.req.header('Authorization')?.replaceAll('Bearer ', '')
    if (!authToken) {
        return c.json({
            status: 401,
            message: 'No token found in the authorization header.'
        }, 401)
    }
    // validate the auth token
    try {
        const user:User = await verify(authToken, c.env.API_SECRET)
        const token:Token|null = await c.prisma.token.findFirst({
            where: {
                user_id: {
                    equals: user.uid
                },
                secret: {
                    equals: user.secret
                }
            }
        })
        if (!token) {
            return c.json({
                status: 401,
                message: 'You access token is not found.'
            }, 401)
        }
        c.set('user', user)
    } catch (error) {
        console.error(error)
        return c.json({
            status: 401,
            message: 'You access token in the authorization header is not valid.'
        }, 401)
    }
    await next()
})
