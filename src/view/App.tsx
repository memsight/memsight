import isProd from "../config/is_prod"
import { Manifest, ManifestItem, ViewData } from "../global"
import { Toaster } from "@/components/ui/sonner"
import { Provider } from 'jotai'

type LayoutProps = {
    children: React.ReactNode,
    view: ViewData,
    manifest?: Manifest,
}

export default function App({ children, view, manifest }: LayoutProps) {
    const viewData = JSON.stringify(view)
    const viewScript = 'var _hono_view = JSON.parse(document.querySelector("meta[name=\'view-data\']").getAttribute("content"));'
    let cssDoms:React.ReactNode[] = []
    let scriptDoms:React.ReactNode[] = []
    if (isProd && manifest) {
        const cssFiles:string[] = []
        const scriptFiles:string[] = []
        for (const [, v] of Object.entries(manifest)) {
            const item:ManifestItem = v
            if (item.isEntry) {
                item.css?.forEach((c) => {
                    cssFiles.push('/' + c)
                })
                if (item.file) {
                    scriptFiles.push('/' + item.file)
                }
            }
        }
        cssDoms = cssFiles.map(l => {
            return <link href={l}  rel="stylesheet" key={l} />
        })
        scriptDoms = scriptFiles.map(s => {
            return <script type="module" src={s} key={s}></script>
        })
    }
    return (
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="apple-touch-icon" sizes="180x180" href="/static/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon-16x16.png" />
                <link rel="manifest" href="/static/site.webmanifest" />
                <link rel="mask-icon" href="/static/safari-pinned-tab.svg" color="#5bbad5" />
                <link rel="shortcut icon" href="/static/favicon.ico" />
                <meta name="msapplication-TileColor" content="#00aba9" />
                <meta name="msapplication-config" content="/static/browserconfig.xml" />
                <meta name="theme-color" content="#ffffff" />
                <title>{view.meta.title}</title>
                {cssDoms}
                <meta name="view-data" content={viewData} />
                <script dangerouslySetInnerHTML={{__html: viewScript}} />
                {!isProd &&<script type="module" src="http://localhost:5174/src/client.tsx"></script>}
            </head>
            <body>
                <Provider>
                    {children}
                    <Toaster richColors />
                    {scriptDoms}
                </Provider>
            </body>
        </html>
    )
}