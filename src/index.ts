import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRoute } from './routes/user'
import { blogRoute } from './routes/blog'

type Bindings = {
  DATABASE_URL: string
  SECRET_KEY: string
}
const app = new Hono<{ Bindings: Bindings }>()
app.use('/*', cors())

app.route('/api/v1/user', userRoute);
app.route('/api/v1/blog', blogRoute);

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app