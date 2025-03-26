import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import bcrypt from 'bcrypt-edge';
import { decode, sign, verify } from 'hono/jwt'


type Bindings = {
  DATABASE_URL: string
  SECRET_KEY: string
}
const app = new Hono<{ Bindings: Bindings }>()

app.post('/api/v1/user/signup', async (c) => {

  const body = await c.req.json();

  try{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(body.password, salt);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        password: hashedPassword,
        username: body.username
      }
    })
    const token = await sign({username: user.username}, c.env.SECRET_KEY);
    console.log(user);
    return c.json({user, token});
  }
  catch (error) {
    console.log(error);
    return c.json({error}, 500);
  }
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