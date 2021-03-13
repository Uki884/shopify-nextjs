import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import dotenv from "dotenv";
import cors from '@koa/cors'
import shopifyAuth from './middlewares/shopifyAuth'
import { verifyRequest } from '@shopify/koa-shopify-auth'
import bodyParser from 'koa-bodyparser'
import path from "path";

dotenv.config();

const port = process.env.PORT || '3000'
const dev = process.env.NODE_ENV !== "production";

const app = next({
  dev,
  dir: path.join( __dirname, '../src'),
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  const { SHOPIFY_API_SECRET } = process.env
  server.keys = [SHOPIFY_API_SECRET as string]
  server.use(cors())
  server.use(session({ secure: true, sameSite: 'none' }, server))
  server.use(bodyParser())
  server.use(shopifyAuth())
  server.use(verifyRequest())

  router.get("(.*)", async (ctx: any) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
})
