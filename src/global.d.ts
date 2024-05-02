import { } from 'hono'
import { PrismaClient } from '@prisma/client'

interface Token {
  id: number,
  name: string
  secret: string
  token?: string
  created_at?: number
}
interface ViewMeta {
  title: string,
  manifest?: Manifest,
}
interface ViewData {
  name?: string,
  meta: ViewMeta,
  props: any,
}
interface ManifestItem {
  file: string
  name: string
  src?: string
  isEntry?: boolean
  imports?: string[]
  css?: string[]
}

interface Manifest {
  [key: string]: ManifestItem
}

interface User {
  avatar: string
  email: string
  secret: string
  exp: number
  iat: number
  iss: string
  jti: string
  name: string
  nbf: number
  sub: string
  uid: number
}

type Bindings = {
  HOME_URL: string
  AUTH_KEY: string
  LOGIN_URL: string
  LOGOUT_URL: string
  API_SECRET: string
  UPSTASH_VECTOR_URL: string
  UPSTASH_VECTOR_TOKEN: string
}

type Variables = {
  user: User
}

declare module 'hono' {
  interface Context {
    view(name: string, data: ViewData): Response | Promise<Response>
    prisma: PrismaClient
  }
  interface ContextVariableMap {
    user: User
  }
}

declare module '@hono/react-renderer' {
  interface Props {
    view: ViewData,
    manifest?: Manifest,
  }
}

declare global {
  interface Window {
    _hono_view: ViewData;
  }
  interface BigInt {
    toJSON(): number
  }
}
