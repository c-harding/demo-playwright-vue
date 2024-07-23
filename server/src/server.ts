import express, { type Request, type Response } from 'express'
import storage from 'node-persist'

interface Todo {
  id: number
  description: string
  time: Date
  editedTime?: Date
  completionTime?: Date
}

const app = express()
const port = process.env.SERVER_PORT || process.env.PORT || 3000
app.use(express.json())

var todoRouter = express.Router()

// Fetch the persisted todos
await storage.init()
const todos: { [key: string]: Todo[] } = (await storage.get('todos')) ?? {}
console.info('Got data for:', Object.keys(todos))

async function persistTodos(initIfMissing = true) {
  try {
    await storage.set('todos', todos)
  } catch (e: unknown) {
    if (initIfMissing && (e as { code?: string })?.code === 'ENOENT') {
      console.error('Error while persisting storage, missing config file', e)
      await storage.init()
      persistTodos(false)
    } else {
      console.error('Error while persisting storage', e)
    }
  }
}

// Persist after every mutable request
const mutableMethods = ['POST', 'DELETE', 'PATCH', 'PUT']
todoRouter.use((req, res, next) => {
  if (mutableMethods.includes(req.method)) {
    res.once('finish', async () => {
      persistTodos()
    })
  }
  next()
})

todoRouter.get('/:user', (req: Request, res: Response) => {
  const user = req.params.user
  res.json(todos[user] || [])
})

todoRouter.post('/:user', (req: Request, res: Response) => {
  const user = req.params.user
  const { description } = req.body

  if (!description) {
    return res.status(400).json({ error: 'Description is required' })
  }

  const newTodo: Todo = {
    id: Date.now(),
    description,
    time: new Date()
  }

  todos[user] ??= []

  todos[user].push(newTodo)
  res.status(201).json(newTodo)
})

todoRouter.delete('/:user/:id', (req: Request, res: Response) => {
  const user = req.params.user
  const id = parseInt(req.params.id)

  if (!todos[user]) {
    return res.status(404).json({ error: 'User not found' })
  }

  todos[user] = todos[user].filter((todo) => todo.id !== id)
  if (todos[user].length === 0) {
    delete todos[user]
  }
  res.status(204).send()
})

todoRouter.patch('/:user/:id', (req: Request, res: Response) => {
  const user = req.params.user
  const id = parseInt(req.params.id)
  const { description } = req.body

  if (!description) {
    return res.status(400).json({ error: 'Description is required' })
  }

  if (!todos[user]) {
    return res.status(404).json({ error: 'User not found' })
  }

  const todo = todos[user].find((todo) => todo.id === id)

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' })
  }

  todo.description = description
  todo.editedTime = new Date()
  res.json(todo)
})

todoRouter.post('/:user/:id/complete', (req: Request, res: Response) => {
  const user = req.params.user
  const id = parseInt(req.params.id)

  if (!todos[user]) {
    return res.status(404).json({ error: 'User not found' })
  }

  const todo = todos[user].find((todo) => todo.id === id)

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' })
  }

  todo.completionTime = new Date()
  res.json(todo)
})

todoRouter.post('/:user/:id/uncomplete', (req: Request, res: Response) => {
  const user = req.params.user
  const id = parseInt(req.params.id)

  if (!todos[user]) {
    return res.status(404).json({ error: 'User not found' })
  }

  const todo = todos[user].find((todo) => todo.id === id)

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' })
  }

  todo.completionTime = undefined
  res.json(todo)
})

app.use('/api/todos', todoRouter)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
