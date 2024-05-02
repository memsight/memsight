import { Hono } from 'hono'
import { renderer } from './renderer'
import initView from './view'
import { ViewRenderer, SimpleAuth, Prisma, ApiAuth } from './middleware'
import { Bindings, Variables } from './global'
import { CreateToken, ResetToken, Home, ListTokens, DeleteToken, ApiSetting } from './handlers/token'
import { init } from './lib/init'
import { CreateNote, NoteHome } from './handlers/note'
import { Logout } from './handlers/auth'

init()
initView()
const app = new Hono<{
  Bindings: Bindings,
  DB: D1Database,
  Variables: Variables,
}>()

app.use(renderer)
app.use(Prisma)
app.use(ViewRenderer)
app.use('/dashboard/*', SimpleAuth)
app.use('/api/tokens/*', SimpleAuth)

app.get('/', Home)
app.post('/auth/logout', Logout)
app.get('/dashboard/api/settings', ApiSetting)
app.get('/dashboard', NoteHome)
app.get('/dashboard/notes', NoteHome)
app.get('/api/tokens', ListTokens)
app.post('/api/tokens', CreateToken)
app.put('/api/tokens/:id', ResetToken)
app.delete('/api/tokens/:id', DeleteToken)
app.post('/api/notes', ApiAuth, CreateNote)
app.get('/api/notes', ApiAuth, NoteHome)

export default app
