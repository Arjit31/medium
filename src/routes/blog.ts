import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

type Bindings = {
    DATABASE_URL: string
    SECRET_KEY: string
}
export const blogRoute = new Hono<{ Bindings: Bindings }>()

blogRoute.post('/', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    return c.text('Hello Hono!')
})
blogRoute.put('/:id', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    return c.text('Hello Hono!')
})
blogRoute.get('/:id', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    return c.text('Hello Hono!')
})
blogRoute.get('/bulk', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    return c.text('Hello Hono!')
})