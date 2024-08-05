const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8080;

// Set up ejs as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use body-parser to handle form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Load tasks from the data.json file
let tasks = require('./init/data.json');

// Render the start page
app.get('/', (req, res) => {
  res.render('start');
});

// Handle the home page with search functionality
app.get('/home', (req, res) => {
  const searchQuery = req.query.search ? req.query.search.toLowerCase() : '';
  const filteredTasks = tasks.filter(task => {
    return typeof task.title === 'string' && task.title.toLowerCase().includes(searchQuery);
  });
  res.render('index', { tasks: filteredTasks, searchQuery });
});

// Route for displaying all tasks
app.get('/show', (req, res) => {
  res.render('show', { tasks });
});

// Route for creating a new task
app.get('/create', (req, res) => {
  res.render('create');
});

// Handle the creation of a new task
app.post('/create', (req, res) => {
  const { title, description } = req.body;
  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    done: false,
    lastUpdated: new Date().toISOString()
  };
  tasks.push(newTask);
  fs.writeFileSync('./init/data.json', JSON.stringify(tasks, null, 2));
  res.redirect('/show');
});

// Route for rendering the update page
app.get('/update/:id', (req, res) => {
  const { id } = req.params;
  const task = tasks.find(task => task.id === parseInt(id));
  res.render('update', { task });
});

// Route for updating a task
app.post('/update/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.map(task =>
    task.id === parseInt(id) ? { ...task, done: !task.done, lastUpdated: new Date().toISOString() } : task
  );
  fs.writeFileSync('./init/data.json', JSON.stringify(tasks, null, 2));
  res.redirect('/show');
});

// Route for deleting a task
app.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(task => task.id !== parseInt(id));
  fs.writeFileSync('./init/data.json', JSON.stringify(tasks, null, 2));
  res.redirect('/show');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});