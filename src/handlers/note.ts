import { User } from "@/global"
import { NoteRequest } from "@/lib/opengraph"
import { sha256 } from "@/lib/utils"
import { Handler } from "hono"
import { Index } from "@upstash/vector"
import { Note } from "@prisma/client"

type NoteFilter = {
    lt: number
    in?: number[]
}

export const NoteHome: Handler = async (c) => {
    const user: User = c.get('user')
    const search: string | undefined = c.req.query('search')
    const scoreStr: string | undefined = c.req.query('score')
    const maxId: string | undefined = c.req.query('id')
    let cursorId = 100000000
    if (maxId && !search) {
        cursorId = parseInt(maxId)
    }
    let score = 0.7
    if (scoreStr) {
        score = parseFloat(scoreStr)
    }
    const idFilter: NoteFilter = {
        lt: cursorId
    }
    let take = 16
    let idList: number[] = []
    if (search) {
        take = 64
        const index = new Index({
            url: c.env.UPSTASH_VECTOR_URL,
            token: c.env.UPSTASH_VECTOR_TOKEN,
        })
        const results = await index.query({
            data: search,
            topK: take,
            filter: "user_id = " + user.uid,
            includeVectors: false,
            includeMetadata: true,
        });
        idList = results.filter(e => {
            return e.score >= score
        }).map((e) => {
            return parseInt(e.id.toString())
        })
        if (idList.length == 0) {
            idList.push(0)
        }
        idFilter.in = idList
    }
    let notes:(Note|undefined)[] = await c.prisma.note.findMany({
        where: {
            user_id: {
                equals: user.uid
            },
            id: idFilter
        },
        orderBy: {
            id: 'desc'
        },
        take,
    })
    if (idList.length > 0) {
        const sortedNotes:(Note|undefined)[] = idList.map((id) => {
            return notes.find((e) => {
                if (!e) {
                    return false
                }
                return e.id.toString() == id.toString()
            })
        }).filter((e) => e)
        if (sortedNotes) {
            notes = sortedNotes
        }
    }
    if (c.req.header('Accept')?.includes('application/json')) {
        return c.json({
            notes,
        })
    }
    return c.view('note', {
        meta: {
            title: 'Honojs demo with react SSR and shadcn UI.',
        },
        props: {
            avatar: user.avatar,
            notes: notes,
            search,
        }
    })
}

export const CreateNote: Handler = async (c) => {
    const user: User = c.get('user')
    const req: NoteRequest = await c.req.json()
    const uriHash = await sha256(req.url)
    const found = await c.prisma.note.findFirst({
        where: {
            uri_hash: {
                equals: uriHash,
            },
            user_id: {
                equals: user.uid,
            }
        }
    })
    if (found) {
        return c.json({
            note: found,
        })
    }
    let opengraph = '{}'
    let image = ''
    let description = ''
    if (req.article.opengraph) {
        opengraph = JSON.stringify(req.article.opengraph)
        if (req.article.opengraph.og && req.article.opengraph.og.description) {
            description = req.article.opengraph.og.description
        }
        if (req.article.opengraph.og && req.article.opengraph.og.image && req.article.opengraph.og.image.length > 0) {
            const img = req.article.opengraph.og.image[0]
            image = img.url
        }
    }
    const note = await c.prisma.note.create({
        data: {
            user_id: user.uid,
            url: req.url,
            uri_hash: uriHash,
            length: req.article.length,
            title: req.article.title,
            site_name: req.article.siteName || '',
            lang: req.article.lang || '',
            dir: req.article.dir || '',
            byline: req.article.byline || '',
            excerpt: req.article.excerpt || '',
            content: req.article.content || '',
            text_content: req.article.textContent || '',
            markdown: req.article.markdown || '',
            published_at: req.article.publishedTime || '',
            wait_timeout: 0,
            created_at: Date.now(),
            description,
            image,
            opengraph,
        }
    })
    const index = new Index({
        url: c.env.UPSTASH_VECTOR_URL,
        token: c.env.UPSTASH_VECTOR_TOKEN,
    })
    await index.upsert({
        id: note.id.toString(),
        data: note.markdown,
        metadata: {
            user_id: note.user_id
        },
    });
    return c.json({
        note,
    })
}