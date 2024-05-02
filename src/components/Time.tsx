import dayjs from 'dayjs/esm'

type TimeProps = {
    timestamp: number
    style?: string
}

type DatetimeProps = {
    datetime: string
    format?: string
    style?: string
}

export function Timestamp({timestamp, style}: TimeProps) {
    const ts = parseInt(timestamp.toString())
    const t = dayjs(ts)
    return <span>{t.format(style)}</span>
}

export function Datetime({datetime, format, style}: DatetimeProps) {
    const t = dayjs(datetime, format)
    return <span>{t.format(style)}</span>
}
