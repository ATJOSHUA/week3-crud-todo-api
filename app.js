const express = require('express');
const app = express();
app.use(express.json());// Parse JSON bodies

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
  { id: 3, task: 'make Money', completed: true },
];

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// ASS 1 (Assignment Task): GET /todos/:id — single todo by ID
app.get('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.status(200).json(todo); // Returns the single matched todo
});

// ASS 2 (Assignment Task): POST with "task" field validation + body spread fix
app.post('/todos', (req, res) => {
  if (!req.body.task) {
    return res.status(400).json({ error: '"task" field is required' }); // Validation added
  }
  const newTodo = { id: todos.length + 1, completed: false, ...req.body }; // Fixed spread
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body);
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id);
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// ASS 3 (Assignment Bonus): GET /todos/active — filter incomplete todos
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter((t) => !t.completed); // !completed = active
  res.status(200).json(activeTodos);
});

// Existing bonus route (kept — same placement rule applies)
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.status(200).json(completed);
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));