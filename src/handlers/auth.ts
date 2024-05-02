import { sha256HMac, unixTimestamp } from "@/lib/utils"
import { Handler } from "hono"

export const Logout:Handler = async (c) => {
    const ts = unixTimestamp()
    const redirect = c.env.HOME_URL
    const sign = await sha256HMac(ts + redirect, c.env.AUTH_KEY)
    const url = c.env.LOGOUT_URL + '?timestamp='+ts+'&redirect='+redirect +'&sign='+sign
    return c.redirect(url, 307)
}