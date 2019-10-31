const Koa = require('koa')
const cors = require('@koa/cors')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const fs = require('fs')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const dataDir = './data'
const dataFile = `${dataDir}/db.json`
const noteDir = `${dataDir}/notes`

// create data folder if it does not exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}
if (!fs.existsSync(noteDir)) {
  fs.mkdirSync(noteDir)
}

// init db
let db
;(async () => {
  const adapter = new FileAsync(dataFile)
  db = await low(adapter)
  db.defaults({ notes: [], tags: [] }).write()
})()

async function readFile(fileName) {
  try {
    return await fs.readFile(`${noteDir}/${fileName}.md`, 'utf8')
  } catch (e) {
    return ''
  }
}

async function writeFile(id, text = '') {
  try {
    await fs.writeFile(`${noteDir}/${id}.md`, text, 'utf8')
  } catch (e) {}
}

const app = new Koa()
app.use(cors())
app.use(bodyParser())

const router = new Router()

router.get('/api/init', async (ctx, next) => {
  await db.read()
  let data = await db.getState()
  let { noteId } = ctx.request.query
  if (noteId) {
    const note = db.get('notes').find({ id: noteId })
    if (note) {
      note.text = await readFile(noteId)
    }
  } else if (data.notes.length) {
    noteId = data.notes[0].id
    data.notes[0].text = await readFile(noteId)
  }
  data.activeNoteId = noteId
  ctx.body = data
})

router.get('/api/getNote/:id', async (ctx, next) => {
  const { id } = ctx.request.params
  ctx.body = {
    text: await readFile(id),
  }
})

router.post('/api/saveNote', async (ctx, next) => {
  const note = ctx.request.body
  console.log(666, note)
  try {
    const { id } = note
    if (id) {
      console.log(111)
      const noteInDb = await db.get('notes').find({ id })
      console.log(222, noteInDb.value())
      if (noteInDb.value()) {
        // update
        const { text, updateAt, tags, favorite, trash } = note
        if (text) {
          await writeFile(id, text)
        }
        if (updateAt) {
          await noteInDb.update(x => ({ ...x, updateAt })).write()
        }
        if (tags) {
          await noteInDb.update(x => ({ ...x, tags })).write()
        }
        if (favorite) {
          await noteInDb.update(x => ({ ...x, favorite })).write()
        }
        if (trash) {
          await noteInDb.update(x => ({ ...x, trash })).write()
        }
      } else {
        // create
        await db
          .get('notes')
          .push(note)
          .write()
        await writeFile(id, note.text)
      }

      ctx.body = {
        msg: 'save ok!',
      }
    } else {
      ctx.body = {
        error: 1,
        msg: 'save note error!',
      }
    }
  } catch (e) {
    ctx.body = {
      error: 1,
      msg: 'save note error!',
    }
  }
})

router.post('/api/updateTags', async (ctx, next) => {
  const { tags } = ctx.request.body
  try {
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
