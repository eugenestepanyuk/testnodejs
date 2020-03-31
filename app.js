let express = require("express");
let fs = require("fs");
const path = require('path');

let app = express();
const blogStorage = path.normalize(path.join(__dirname, 'blogs.json'));
app.use(express.static(__dirname + "/public"));

// получение списка данных
app.get("/api/blogs", (request, response) => {
    let content = fs.readFileSync("blogs.json", "utf8");
    let blogs = JSON.parse(content);
    response.send(blogs);
});
// получение одного блога по id
app.get("/api/blogs/:id", (request, response) => {
    let id = request.params.id; // получаем id
    let content = fs.readFileSync("blogs.json", "utf8");
    let blogs = JSON.parse(content);
    // находим в массиве блог по id
    const blog = blogs.find(blog => blog.id == id);
    // отправляем блог
    if(blog) response.send(blog);
    else response.status(404).send();
});
// получение отправленных данных
app.post("/api/blogs", express.json(), (request, response) => {
    if(!request.body) return response.sendStatus(400);
    const { name: blogName, content: blogContent } = request.body;
    let blog = {name: blogName, content: blogContent};

    var data = fs.readFileSync("blogs.json", "utf8");
    let blogs = JSON.parse(data);
    // находим максимальный id
    const latestId = blogs.reduce((acc, blog) =>{
        if(blog.id > acc) return blog.id;
        return acc;
    }, 0);
    // увеличиваем его на единицу
    blog.id = latestId + 1;
    // добавляем блог в массив
    blogs.push(blog);
    var data = JSON.stringify(blogs);
    // перезаписываем файл с новыми данными
    fs.writeFileSync(blogStorage, data);
    response.send(blog);
});
// удаление блога по id
app.delete("/api/blogs/:id", (request, response) => {
    let id = request.params.id;
    let data = fs.readFileSync("blogs.json", "utf8");
    let blogs = JSON.parse(data);
    let index = -1;
    // находим индекс блога в массиве
    for(let i = 0; i < blogs.length; i++){
        if(blogs[i].id == id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем блог из массива по индексу
        let blog = blogs.splice(index, 1)[0];
        let data = JSON.stringify(blogs);
        fs.writeFileSync(blogStorage, data);
        // отправляем удаленный блог
        response.send(blog);
    }
    else response.status(404).send();
});
// изменение блога
app.put("/api/blogs", express.json(), (request, response) => {
    if(!request.body) return response.sendStatus(400);
    const { id: blogId, name: blogName, content: blogContent } = request.body;

    let data = fs.readFileSync("blogs.json", "utf8");
    let blogs = JSON.parse(data);
    let blog;
    for(let i = 0; i < blogs.length; i++){
        if(blogs[i].id == blogId){
            blog = blogs[i];
            break;
        }
    }
    // изменяем данные блога
    if(blog){
        blog.content = blogContent;
        blog.name = blogName;
        let data = JSON.stringify(blogs);
        fs.writeFileSync(blogStorage, data);
        response.send(blog);
    }
    else response.status(404).send(blog);
});

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});