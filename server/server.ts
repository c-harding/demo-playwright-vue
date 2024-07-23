import express, { type Request, type Response } from 'express';

interface Todo {
  id: number;
  description: string;
  time: Date;
  editedTime?: Date;
  completionTime?: Date;
}

const app = express();
const port = 3000;
app.use(express.json());

const todos: { [key: string]: Todo[] } = {};

app.get('/todos/:user', (req: Request, res: Response) => {
  const user = req.params.user;
  res.json(todos[user] || []);
});

app.post('/todos/:user', (req: Request, res: Response) => {
  const user = req.params.user;
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  const newTodo: Todo = {
    id: Date.now(),
    description,
    time: new Date(),
  };

  if (!todos[user]) {
    todos[user] = [];
  }

  todos[user].push(newTodo);
  res.status(201).json(newTodo);
});

app.delete('/todos/:user/:id', (req: Request, res: Response) => {
  const user = req.params.user;
  const id = parseInt(req.params.id);

  if (!todos[user]) {
    return res.status(404).json({ error: 'User not found' });
  }

  todos[user] = todos[user].filter((todo) => todo.id !== id);
  res.status(204).send();
});

app.patch('/todos/:user/:id', (req: Request, res: Response) => {
  const user = req.params.user;
  const id = parseInt(req.params.id);
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  if (!todos[user]) {
    return res.status(404).json({ error: 'User not found' });
  }

  const todo = todos[user].find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todo.description = description;
  todo.editedTime = new Date();
  res.json(todo);
});

app.post('/todos/:user/:id/complete', (req: Request, res: Response) => {
  const user = req.params.user;
  const id = parseInt(req.params.id);

  if (!todos[user]) {
    return res.status(404).json({ error: 'User not found' });
  }

  const todo = todos[user].find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todo.completionTime = new Date();
  res.json(todo);
});

app.post('/todos/:user/:id/uncomplete', (req: Request, res: Response) => {
  const user = req.params.user;
  const id = parseInt(req.params.id);

  if (!todos[user]) {
    return res.status(404).json({ error: 'User not found' });
  }

  const todo = todos[user].find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todo.completionTime = undefined;
  res.json(todo);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
