import { Hono } from 'hono'

const app = new Hono()

app.post('/api/v1/user/signup', (c) => {
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

// DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiN2NmYmUyOWItYWQwZC00OWUwLTlhZWUtOTg3YmU3ZWY2NzZhIiwidGVuYW50X2lkIjoiMGVlYzM1MzIxMmY2MTRlYWJjNDAwYTEwZDA5YzE2NmVhNDI1ZGVjM2VlNTJiOWFhZmQ3NTc0NzdiZDc3NGM0NyIsImludGVybmFsX3NlY3JldCI6ImZhNjUxZWRlLTRmNjAtNGE5Ni1iZmQ4LWQ3YWQ4NjFmNDAzOSJ9.bHA8io60kowkHVQV0spJoWNzoe7lsN3USUMc15kVXgU"

//DIRECT_URL="postgresql://neondb_owner:npg_aT1Dyvkdr2oL@ep-soft-glade-a5x3oont-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"