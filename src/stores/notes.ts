import { useReducer } from 'react'
import { createContainer } from 'unstated-next'
import { FolderKeys, Folders, Note, NoteId, Tag } from '../types'
import uuid from 'uuid'

export enum NoteActionType {
  CHOOSE_FOLDER = 'CHOOSE_FOLDER',
  CHOOSE_TAG = 'CHOOSE_TAG',
  CHOOSE_NOTE = 'CHOOSE_NOTE',
  ADD_NOTE = 'ADD_NOTE',
  EDIT_NOTE = 'EDIT_NOTE',
}

export type NoteAction =
  | { type: NoteActionType.CHOOSE_FOLDER; payload: FolderKeys }
  | { type: NoteActionType.CHOOSE_TAG; payload: Tag }
  | { type: NoteActionType.CHOOSE_NOTE; payload: NoteId }
  | { type: NoteActionType.ADD_NOTE }
  | { type: NoteActionType.EDIT_NOTE; payload: Partial<Note> }

export interface NoteState {
  notes: Note[]
  activeFolder: FolderKeys
  activeTag: Tag | null
  activeNoteId: NoteId
  error: string
  loading: boolean
}

export const initialNoteState: NoteState = {
  notes: [
    {
      id: uuid.v4(),
      title: 'Test Note 1',
      content:
        "# Create and Deploy a Node JS Server\n\nRecently, I wanted to create and host a Node server, and discovered that [Heroku](https://heroku.com) is an excellent cloud platform service that has free hobby hosting for Node and PostgreSQL, among many other languages and databases.\n\nThis tutorial walks through creating a local REST API with Node using an Express server and PostgreSQL database. It also lists the instructions for deploying to Heroku.\n\n#### Prerequisites\n\nThis guide uses installation instructions for macOS and assumes a prior knowledge of:\n\n- [Command line usage](/how-to-use-the-command-line-for-apple-macos-and-linux/)\n- [Basic JavaScript](/javascript-day-one/)\n- [Basic Node.js and npm](/how-to-install-and-use-node-js-and-npm-mac-and-windows/)\n- [SQL](/overview-of-sql-commands-and-pdo-operations/) and [PostgreSQL](https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/)\n- [Understanding REST/REST APIs](https://code.tutsplus.com/tutorials/code-your-first-api-with-nodejs-and-express-understanding-rest-apis--cms-31697)\n\n#### Goals\n\nThis walkthrough will have three parts:\n\n- [Setting up a local **PostgreSQL database**](#set-up-postgresql-database)\n- [Setting up a local **Node/Express API server**](#create-express-api)\n- [Deploying the Node, Express, PostgreSQL API to **Heroku**](#deploy-app-to-heroku)\n\nWe'll create a local, simple REST API in Node.js that runs on an Express server and utilizes PostgreSQL for a database. Then we'll deploy it to Heroku.\n\nI also have a few production tips for validation and rate limiting.\n\n- [4. Production tips](#production-tips)\n\n## Set Up PostgreSQL Database\n\nWe're going to:\n\n- Install PostgreSQL\n- Create a user\n- Create a database, table, and entry to the table\n\nThis will be a very quick runthrough - if it's your first time using PostgreSQL, or Express, I recommend reading [Setting up a RESTful API with Node.js and PostgreSQL](https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/).\n\nInstall and start PostgreSQL.\n\n```bash\nbrew install postgresql\nbrew services start postgresql\n```\n\nLogin to `postgres`.\n\n```bash\npsql postgres\n```\n\nCreate a user and password and give them create database access.\n\n```bash\nCREATE ROLE api_user WITH LOGIN PASSWORD 'password';\nALTER ROLE api_user CREATEDB;\n```\n\nLog out of the root user and log in to the newly created user.\n\n```bash\n\\q\npsql -d postgres -U api_user\n```\n\nCreate a `books_api` database and connect to it.\n\n```sql\nCREATE DATABASE books_api;\n\\c books_api\n```\n\nCreate a `books` table with `ID`, `author`, and `title`.\n\n```sql\nCREATE TABLE books (\n  ID SERIAL PRIMARY KEY,\n  author VARCHAR(255) NOT NULL,\n  title VARCHAR(255) NOT NULL\n);\n```\n\nInsert one entry into the new table.\n\n```sql\nINSERT INTO books (author, title)\nVALUES  ('J.K. Rowling', 'Harry Potter');\n```\n\n## Create Express API\n\nThe Express API will set up an Express server and route to two endpoints, `GET` and `POST`.\n\nCreate the following files:\n\n- `.env` - file containing environment variables (does not get version controlled)\n- `package.json` - information about the project and dependencies\n- `init.sql` - file to initialize PostgreSQL table\n- `config.js` - will create the database connection\n- `index.js` - the Express server\n\n```bash\ntouch .env package.json init.sql config.js index.js\n```",
      tags: [],
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    },
    {
      id: uuid.v4(),
      title: 'Test Note 2',
      content:
        '## How Strings are Indexed\n\nEach of the characters in a string correspond to an index number, starting with `0`.\n\nTo demonstrate, we will create a string with the value `How are you?`.\n\n| H   | o   | w   |     | a   | r   | e   |     | y   | o   | u   | ?   |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n| 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  |',
      tags: [],
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
      favorite: true,
    },
    {
      id: uuid.v4(),
      title: 'Test Note 3',
      content:
        "Writing a Simple MVC App in Plain JavaScript\n\n---\ndate: 2019-07-30\ntitle: 'Writing a Simple MVC App in Plain JavaScript'\ntemplate: post\nthumbnail: '../thumbnails/triangle.png'\nslug: javascript-mvc-todo-app\ncategories:\n  - Popular\n  - Code\ntags:\n  - javascript\n  - mvc\n  - architecture\n---\n\nI wanted to write a simple application in plain JavaScript using the [model-view-controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) architectural pattern. So I did, and here it is. Hopefully it helps you understand MVC, as it's a difficult concept to wrap your head around when you're first starting out.\n\nI made [this todo app](https://taniarascia.github.io/mvc), which is a simple little browser app that allows you to CRUD (create, read, update, and delete) todos. It just consists of an `index.html`, `style.css`, and `script.js`, so nice and simple and dependency/framework-free for learning purposes.\n\n#### Prerequisites\n\n- Basic JavaScript and HTML\n- Familiarity with [the latest JavaScript syntax](https://www.taniarascia.com/es6-syntax-and-feature-overview/)\n\n#### Goals\n\nCreate a todo app in the browser with plain JavaScript, and get familiar with the concepts of MVC (and OOP - object-oriented programming).\n\n- [View demo](https://taniarascia.github.io/mvc)\n- [View source](https://github.com/taniarascia/mvc)\n\n> **Note:** Since this app uses the latest JavaScript features (ES2017), it won't work as-is on some browsers like Safari without using Babel to compile to backwards-compatible JavaScript syntax.\n\n## What is Model View Controller?\n\nMVC is one possible pattern for organizing your code. It's a popular one.\n\n- **Model** - Manages the data of an application\n- **View** - A visual representation of the model\n- **Controller** - Links the user and the system\n\nThe **model** is the data. In this todo application, that'll be the actual todos, and the methods that will add, edit, or delete them.\n\nThe **view** is how the data is displayed. In this todo application, that will be the rendered HTML in the DOM and CSS.\n\nThe **controller** connects the model and the view. It takes user input, such as clicking or typing, and handles callbacks for user interactions.\n\nThe model never touches the view. The view never touches the model. The controller connects them.\n\n> I'd like to mention that doing MVC for a simple todo app is actually a ton of boilerplate. It would really be overcomplicating things if this was the app you wanted to create and you made this whole system. The point is to try to understand it on a small level so you can understand why a scaled system might use it.",
      tags: [],
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
      trash: true,
    },
  ],
  activeFolder: Folders.ALL,
  activeTag: null,
  activeNoteId: '',
  error: '',
  loading: false,
}

export function notesReducer(state: NoteState, action: NoteAction): NoteState {
  switch (action.type) {
    case NoteActionType.CHOOSE_FOLDER:
      return { ...state, activeFolder: action.payload, activeTag: null }
    case NoteActionType.CHOOSE_TAG:
      return { ...state, activeFolder: Folders.TAG, activeTag: action.payload }
    case NoteActionType.CHOOSE_NOTE:
      return { ...state, activeNoteId: action.payload }
    case NoteActionType.ADD_NOTE:
      const now = new Date().toISOString()
      const newNote: Note = {
        id: uuid.v4(),
        title: 'New note',
        content: '',
        tags: [],
        createAt: now,
        updateAt: now,
      }
      return { ...state, notes: [...state.notes, newNote] }
    case NoteActionType.EDIT_NOTE:
      const idx = state.notes.findIndex(x => x.id === state.activeNoteId)
      return {
        ...state,
        notes: [
          ...state.notes.slice(0, idx),
          {
            ...state.notes[idx],
            ...action.payload,
            updateAt: new Date().toISOString(),
          },
          ...state.notes.slice(idx + 1),
        ],
      }
    default:
      return state
  }
}

function useNotes(initial: NoteState = initialNoteState) {
  const [state, dispatch] = useReducer(notesReducer, initial)
  return { noteState: state, noteDispatch: dispatch }
}

export const NoteContainer = createContainer(useNotes)
