import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

type Bindings = {
  DATABASE_URL: string
}
const app = new Hono<{ Bindings: Bindings }>()

app.post('/api/v1/user/signup', (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  return c.json('Hello Hono! signup')
})
app.post('/api/v1/user/signin', (c) => {
  return c.text('Hello Hono!')
})
app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})
app.get('/api/v1/blog/:id', (c) => {
  return c.text('Hello Hono!')
})
app.get('/api/v1/blog/bulk', (c) => {
  return c.text('Hello Hono!')
})
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app