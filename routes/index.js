const fs = require('fs');
const path = require('path');

const postStorage = path.normalize(path.join(__dirname, '..', 'posts.json'));

exports.getPosts = (request, response) => {
    const content = fs.readFileSync('posts.json', 'utf8');
    const posts = JSON.parse(content);
    response.status(200).send(posts);
};

exports.getPost = (request, response) => {
    const id = request.params.id; // получаем id
    const content = fs.readFileSync('posts.json', 'utf8');
    const posts = JSON.parse(content);
    // находим в массиве блог по id
    const post = posts.find(post => post.id === id);
    // отправляем блог
    if (post) response.send(post);
    else response.status(404).send();
};

exports.addPostDom = (request, response) => {
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
};

exports.updatePostDom = (request, response) => {
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
};

exports.removePostDom = (request, response) => {
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
};