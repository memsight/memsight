'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import Dashboard from "./Dashboard"
import TokenForm from "@/components/TokenForm"
import { useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { tokensAtom } from "@/store"
import { Token } from "@/global"
import TokenDelete from "@/components/TokenDelete"
import TokenRenew from "@/components/TokenRenew"
import { Timestamp } from "@/components/Time"

type AppProps = {
    children: React.ReactNode
    req_url: string
    tokens?: Token[]
}
export default function ApiSetting({ children, req_url, ...props }: AppProps) {
    const tkns:Token[] = props.tokens || []
    useHydrateAtoms([[tokensAtom, tkns]])
    const [tokens] = useAtom(tokensAtom)
    return <Dashboard url={req_url} {...props}>
        <TokenForm></TokenForm>

        <Card className="w-full">
            <CardHeader className="px-7">
                <CardTitle>Tokens</CardTitle>
                <CardDescription>All of your tokens for use with the API.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-accent">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden sm:table-cell">Secret</TableHead>
                            <TableHead className="hidden sm:table-cell">Created At</TableHead>
                            <TableHead className="hidden sm:table-cell">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tokens.map(t => <TableRow key={t.id}>
                            <TableCell>
                                <div className="font-medium">{t.name}</div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">{t.secret}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <Badge className="text-xs" variant="secondary">
                                    <Timestamp timestamp={t.created_at || 0} style="YYYY/MM/DD" />
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <TokenRenew className="mr-2" id={t.id}></TokenRenew>
                                <TokenDelete id={t.id}></TokenDelete>
                            </TableCell>
                        </TableRow>)}
                        {!tokens.length && <TableRow>
                            <TableCell colSpan={4}>
                                <p className="p-4 text-gray-400 text-center text-lg">Just a heads-up: there aren't any tokens, so you'll need to create one first.</p>
                            </TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </Dashboard>
}