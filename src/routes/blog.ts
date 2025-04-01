import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { createPostInput, updatePostInput } from '@arjit31/medium-common-module'
import { auth } from '../middleware/auth'

type Bindings = {
    DATABASE_URL: string
    SECRET_KEY: string
}

type Variables = {
    userId: any
}

export const blogRoute = new Hono<{ Bindings: Bindings, Variables: Variables }>()

blogRoute.use('/*', async(c, next) =>{
    await auth(c, next);
})


blogRoute.post('/', async (c) => {
    const body = await c.req.json();
    const { success } = createPostInput.safeParse(body);
    if (!success) {
        c.status(400);
        return c.json({ error: "invalid input" });
    }
    const userId = c.get('userId')
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        // console.log(userId, body);
        const blog = await prisma.blog.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId,
                published: true
            }
        })
        return c.json(blog);
    } catch (error) {
        return c.json({ error }, 500)
    }
})

blogRoute.put('/:id', async (c) => {
    const userId = c.get('userId')
    const id = c.req.param('id')
    const body = await c.req.json();
    const { success } = updatePostInput.safeParse(body);
    if (!success) {
        c.status(400);
        return c.json({ error: "invalid input" });
    }

    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.blog.findUnique({
            where: {
                id: id
            }
        })
        if (!blog || blog.authorId != userId) {
            return c.json("Wrong input!", 401);
        }
        const updatedBlog = prisma.blog.update({
            where: {
                id: id
            },
            data: {
                title: body.title,
                content: body.content
            }
        })
        return c.json(updatedBlog);
    } catch (error) {
        return c.json({ error }, 500)
    }
})
blogRoute.get('/test', (c) => c.json({ message: "Test route works!" }));

blogRoute.get('/bulk', async (c) => {
    try {
        // console.log("hello")
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        const blog = await prisma.blog.findMany({
            orderBy: [
                {
                    updatedAt: 'desc',
                },
            ],
            include: {
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });
        return c.json(blog);
    } catch (error) {
        return c.json({ error }, 500)
    }
})
blogRoute.get('/:id', async (c) => {
    const id = c.req.param('id')
    const userId = c.get('userId')
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        const blog = await prisma.blog.findUnique({
            where: {
                id: id
            },
            include: {
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })
        if (!blog || blog.authorId != userId) {
            return c.json("Wrong input!", 401);
        }
        return c.json(blog);
    } catch (error) {
        return c.json({ error }, 500)
    }
})