export interface NoteRequest {
    url: string
    article: Article
}

export interface Article {
    title: string
    byline?: string
    dir?: string
    lang?: string
    content: string
    textContent: string
    length: number
    excerpt?: string
    siteName?: string
    publishedTime?: string
    markdown?: string
    opengraph?: Opengraph
}

export interface Opengraph {
    al: AppList
    fb: Facebook
    og: OpengraphData
    article: ArticleInfo
    twitter: Twitter
}

export interface AppList {
    ios: IOS
    android: Android
    web: Web
}

export interface IOS {
    app_name: string
    app_store_id: string
    url: string
}

export interface Android {
    package: string
    url: string
    app_name: string
}

export interface Web {
    url: string
}

export interface Facebook {
    app_id: string
}

export interface OpengraphData {
    site_name?: string
    type: string
    title: string
    description?: string
    url?: string
    image?: Image[]
}

export interface Image {
    url: string
    alt?: string
    width?: Number
    height?: Number
}

export interface ArticleInfo {
    published_time: string
    author?: string[]
}

export interface Twitter {
    title?: string
    description?: string
}
