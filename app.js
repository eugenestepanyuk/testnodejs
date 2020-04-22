const express = require('express');
//const fs = require('fs');
const path = require('path');

const routes = require('./routes/index');
const port = process.env.PORT || 3000;

const app = express();

//const postStorage = path.normalize(path.join(__dirname, 'posts.json'));
const BOOTSTRAP_CSS = path.normalize(path.join(__dirname, 'node_modules/bootstrap/dist/css'));

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use('/node_modules/bootstrap/dist/css', express.static(BOOTSTRAP_CSS));

// получение списка данных
app.get('/api/posts', routes.getPosts);

// получение одного блога по id
app.get('/api/posts/:id', routes.getPost);

// получение отправленных данных
app.post('/api/posts', routes.addPostDom);

// изменение блога
app.put('/api/posts', routes.updatePostDom);

// удаление блога по id
app.delete('/api/posts/:id', routes.removePostDom);

// подключение сервера
app.listen(3000, function(){
    console.log(`Server has been started on ${port} port..`);
});