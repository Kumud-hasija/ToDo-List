const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app=express();
const port=8080;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));


let tasks = require('./init/data.json');

app.get('/', (req, res) => {
  res.render('start');
});

app.post('/home', (req, res) => {
  const searchQuery = req.query.search || '';
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  res.render('index', { tasks: filteredTasks, searchQuery });
});



app.post('/create',(req,res)=>{
    const { title, description } = req.body;
    const newtask = {
    id: tasks.length + 1,
    title,
    description,
    done: false,
    lastUpdated: new Date().toISOString()
  };
  tasks.push(newtask);
  fs.writeFileSync('./init/data.json', json.stringify(tasks, null, 2));
  res.redirect('/');
})

app.post('/update/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.map(task =>
      task.id === parseInt(id) ? { ...task, done: !task.done } : task
    );
    fs.writeFileSync('./init/data.json', json.stringify(tasks, null, 2));
    res.redirect('/');
  });

app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})