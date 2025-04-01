import { Next } from "hono";
import { decode, sign, verify } from 'hono/jwt'

export async function auth(c: any, next: Next){
    console.log("Middleware reached for path:", c.req.path);
        console.log("Headers:", c.req.header);
        let rawToken = c.req.header("Authorization");
        console.log(rawToken);
        if (!rawToken) {
            return c.json("unauthorized!", 401);
        }
        const token = rawToken.split(' ')[1];
        const payload = await verify(token, c.env.SECRET_KEY);
        if (!payload) {
            return c.json("unauthorized!", 401);
        }
        // const payload = await decode(token);
        c.set('userId', payload.id);
        console.log(payload);
        await next();
}