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

function readFile(fileName) {
  return new Promise(resolve => {
    fs.readFile(`${noteDir}/${fileName}.md`, 'utf8', (err, data) => {
      if (err) {
        console.log(err)
        resolve('')
      }
      resolve(data)
    })
  })
}

function writeFile(id, text = '') {
  return new Promise(resolve => {
    fs.writeFile(`${noteDir}/${id}.md`, text, 'utf8', err => {
      if (err) {
        console.log(err)
      }
      resolve()
    })
  })
}

const app = new Koa()
app.use(cors())
app.use(bodyParser())

const router = new Router()

router.get('/api/init', async ctx => {
  await db.read()
  let data = await db.getState()
  let { noteId } = ctx.request.query
  if (noteId) {
    const note = data.notes.find(x => x.id === noteId)
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

router.get('/api/getNote/:id', async ctx => {
  const { id } = ctx.request.params
  ctx.body = {
    text: await readFile(id),
  }
})

router.post('/api/saveNoteMeta', async ctx => {
  const note = ctx.request.body
  try {
    const { id, ...updator } = note
    if (id) {
      const notesDB = await db.get('notes')
      const noteInDb = await notesDB.find({ id })
      if (noteInDb.value()) {
        // update
        await noteInDb.assign(updator).write()
      } else {
        // create
        await notesDB.push(note).write()
      }
      ctx.body = {
        msg: 'save note ok!',
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

router.post('/api/saveNoteContent', async ctx => {
  const note = ctx.request.body
  try {
    const { id, text } = note
    if (id && text) {
      await writeFile(id, text)
      ctx.body = {
        msg: 'save note ok!',
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

router.post('/api/saveTags', async ctx => {
  const tags = ctx.request.body
  try {
    await db.update('tags', () => tags || []).write()
    ctx.body = {
      msg: 'save tag ok!',
    }
  } catch (e) {
    ctx.body = {
      error: 1,
      msg: 'save tag error!',
    }
  }
})

router.get('/', (ctx, next) => {
  // ctx.router available
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(4010)
