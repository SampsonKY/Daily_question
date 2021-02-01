const Koa = require('koa');

const kPort = 8000;

const app = new Koa();

app.use(async ctx=>{
    ctx.body = 'hello world;'
})

app.listen(kPort, () =>{
    console.log(`listening on: ${kPort}`);
})