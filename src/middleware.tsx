import { User, ViewData } from "./global"
import { getViewByName } from "./renderer"
import manifest from './lib/manifest.json'
import { getCookie } from "hono/cookie"
import { verify } from 'hono/jwt'
import { createMiddleware } from "hono/factory"
import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1'
import * as DrizzleSchema from './schema/schema'
import { eq, and } from 'drizzle-orm'

let drizzleCli: DrizzleD1Database<typeof DrizzleSchema> | undefined

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

export const Drizzle = createMiddleware(async (c, next) => {
    if (!drizzleCli) {
        drizzleCli = drizzle(c.env.DB, { schema: DrizzleSchema});
        console.info('init drizzle client')
    }
    c.db = drizzleCli
    await next()
})

export const SimpleAuth = createMiddleware(async (c, next) => {
    let authToken = c.req.header('Authorization')?.replaceAll('Bearer ', '')
    if (!authToken) {
        authToken = getCookie(c, 'auth-token')
    }
    if (!authToken) {
        const accept = c.req.header('Accept')
        if (accept?.includes('application/json')) {
            return c.json({
                status: 401,
                message: 'You must be logged in to access these resources.',
                accept,
            }, 401)
        } else {
            return c.redirect(c.env.LOGIN_URL + '?redirect=' + c.req.url)
        }
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
                message: 'You must be logged in to access these resources.',
                accept,
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
        const token = await c.db.query.tokens.findFirst({
            where: and(
                eq(DrizzleSchema.tokens.userId, user.uid),
                eq(DrizzleSchema.tokens.secret, user.secret)
            ),
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
