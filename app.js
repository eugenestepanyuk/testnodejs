const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const postStorage = path.normalize(path.join(__dirname, 'posts.json'));
const bootstrap_css = path.normalize(path.join(__dirname, 'node_modules/bootstrap/dist/css'));

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use('/node_modules/bootstrap/dist/css', express.static(bootstrap_css));

// получение списка данных
app.get('/api/posts', (request, response) => {
    const content = fs.readFileSync('posts.json', 'utf8');
    const posts = JSON.parse(content);
    response.send(posts);
});

// получение одного блога по id
app.get('/api/posts/:id', (request, response) => {
    const id = request.params.id; // получаем id
    const content = fs.readFileSync('posts.json', 'utf8');
    const posts = JSON.parse(content);
    // находим в массиве блог по id
    const post = posts.find(post => post.id === id);
    // отправляем блог
    if (post) response.send(post);
    else response.status(404).send();
});

// получение отправленных данных
app.post('/api/posts', (request, response) => {
    if(!request.body) return response.sendStatus(400);
    const { name, content } = request.body;
    const post = {name, content};

    var data = fs.readFileSync('posts.json', 'utf8');
    const posts = JSON.parse(data);
    // находим максимальный id
    const latestId = posts.reduce((acc, post) =>{
        if(post.id > acc) return post.id;
        return acc;
    }, 0);
    // увеличиваем его на единицу
    post.id = latestId + 1;
    // добавляем блог в массив
    posts.push(post);
    var data = JSON.stringify(posts);
    // перезаписываем файл с новыми данными
    fs.writeFileSync(postStorage, data);
    response.send(post);
});

// удаление блога по id
app.delete('/api/posts/:id', (request, response) => {
    const id = request.params.id;
    const data = fs.readFileSync('posts.json', 'utf8');
    const posts = JSON.parse(data);
    let index = -1;
    // находим индекс блога в массиве
    for(let i = 0; i < posts.length; i++){
        if(posts[i].id == id){
            index = i;
            break;
        }
    }
    if(index > -1){
        // удаляем блог из массива по индексу
        const post = posts.splice(index, 1)[0];
        const data = JSON.stringify(posts);
        fs.writeFileSync(postStorage, data);
        // отправляем удаленный блог
        response.send(post);
    }
    else response.status(404).send();
});

// изменение блога
app.put('/api/posts', (request, response) => {
    if(!request.body) return response.sendStatus(400);
    const { id: postId, name: postName, content: postContent } = request.body;

    const data = fs.readFileSync('posts.json', 'utf8');
    const posts = JSON.parse(data);
    let post;
    for(let i = 0; i < posts.length; i++){
        if(posts[i].id == postId){
            post = posts[i];
            break;
        }
    }
    // изменяем данные блога
    if(post){
        post.content = postContent;
        post.name = postName;
        const data = JSON.stringify(posts);
        fs.writeFileSync(postStorage, data);
        response.send(post);
    }
    else response.status(404).send(post);
});

app.listen(3000, function(){
    console.log('Сервер ожидает подключения...');
});