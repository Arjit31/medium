import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import bcrypt from 'bcrypt-edge';
import { decode, sign, verify } from 'hono/jwt'
import { signinInput, signupInput } from '@arjit31/medium-common-module'
import { auth } from '../middleware/auth';

type Bindings = {
  DATABASE_URL: string
  SECRET_KEY: string
}

type Variables = {
  userId: any
}

export const userRoute = new Hono<{ Bindings: Bindings, Variables: Variables }>()



userRoute.use('/user/*', async(c, next) =>{
    await auth(c, next);
})

userRoute.post('/signup', async (c) => {

    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ error: "invalid input" });
    }
  
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
      const token = await sign({id: user.id, iat: Math.floor(Date.now() / 1000)}, c.env.SECRET_KEY);
      console.log(user);
      const {password, ...userWithoutPassword} = user;
      return c.json({user: userWithoutPassword, token});
    }
    catch (error) {
      console.log(error);
      return c.json({error}, 500);
    }
  })
  
  
  userRoute.post('/signin', async (c) => {
    
    const body = await c.req.json();
    const { success, error } = signinInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ error: "invalid input",  err: error});
    }
  
    try {
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      const user = await prisma.user.findUnique({
        where: {
          username: body.username
        }
      })
      if(!user){
        return c.json("user not found!", 404);
      }
      const isCorrect = bcrypt.compareSync(body.password, user.password);
      if(!isCorrect){
        return c.json("Wrong password", 401);
      }
      const token = await sign({id: user.id, iat: Math.floor(Date.now() / 1000)}, c.env.SECRET_KEY);
      const {password, ...userWithoutPassword} = user;
      return c.json({user: userWithoutPassword, token});
    } catch (error) {
      return c.json({error}, 500);
    }
  })

  userRoute.get("/user", async (c) => {
    const userId = c.get('userId')
    try {
      const prisma = new PrismaClient({
          datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      const user = await prisma.user.findUnique({
          where: {
              id: userId
          }
      })
      if (!user || user.id != userId) {
          return c.json("Wrong input!", 401);
      }
      const {password, ...userWithoutPassword} = user;
      return c.json({user: userWithoutPassword});
  } catch (error) {
      return c.json({ error }, 500)
  }

  })