const Koa = require('koa')
const cors = require('@koa/cors')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const fs = require('fs')

const dataDir = './data'
const dataFile = `${dataDir}/data.json`
const noteDir = `${dataDir}/notes`

// create data folder if it does not exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}

function getMetaString({ createAt, updateAt, tags, favorite, trash } = {}) {
  return `----
createAt: ${createAt}
updateAt: ${updateAt}
tags: ${tags.join(',')}
favorite: ${favorite + ''}
trash: ${trash + ''}
---`
}

const app = new Koa()
app.use(cors())
app.use(bodyParser())

const router = new Router()

router.get('/api/init', async (ctx, next) => {
  let obj
  try {
    obj = JSON.parse(await fs.readFile(dataFile, 'utf8'))
  } catch (e) {
    obj = {
      notes: [],
      tags: [],
    }
  }
  ctx.body = obj
})

router.get('/api/getNote/:id', async (ctx, next) => {
  const { id } = ctx.request.params

  let text
  try {
    text = await fs.readFile(`${noteDir}/${id}.md`, 'utf8')
    ctx.body = {
      id,
      text: '',
      createAt: '',
      updateAt: '',
      tags: [],
      favorite: false,
      trash: false,
    }
  } catch (e) {
    ctx.body = {
      error: 1,
      msg: 'not found',
    }
  }
})

router.post('/api/saveNote', async (ctx, next) => {
  const note = ctx.request.body

  let text
  try {
    const meta = getMetaString(note)
    await fs.writeFile(`${noteDir}/${id}.md`, text, 'utf8')
    ctx.body = {
      msg: 'save ok!',
    }
  } catch (e) {
    ctx.body = {
      error: 1,
      msg: 'save note error!',
    }
  }
})

router.get('/', (ctx, next) => {
  // ctx.router available
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(4010)
