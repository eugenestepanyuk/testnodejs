let express = require("express");
let fs = require("fs");

let app = express();

app.use(express.static(__dirname + "/public"));
// получение списка данных
app.get("/api/blogs", function(request, response){

    let content = fs.readFileSync("blogs.json", "utf8");
    let blogs = JSON.parse(content);
    response.send(blogs);
});
// получение одного блога по id
app.get("/api/blogs/:id", function(request, response){

    let id = request.params.id; // получаем id
    let content = fs.readFileSync("blogs.json", "utf8");
    let blogs = JSON.parse(content);
    let blog = null;
    // находим в массиве блог по id
    for(let i = 0; i < blogs.length; i++){
        if(blogs[i].id == id){
            blog = blogs[i];
            break;
        }
    }
    // отправляем блог
    if(blog) response.send(blog);
    else response.status(404).send();
});
// получение отправленных данных
app.post("/api/blogs", express.json(), function (request, response) {
    if(!request.body) return response.sendStatus(400);

    let blogName = request.body.name;
    let blogContent = request.body.content;
    let blog = {name: blogName, content: blogContent};

    var data = fs.readFileSync("blogs.json", "utf8");
    let blogs = JSON.parse(data);

    // находим максимальный id
    let id = Math.max.apply(Math, blogs.map(function(o){return o.id;}))
    // увеличиваем его на единицу
    blog.id = id + 1;
    // добавляем блог в массив
    blogs.push(blog);
    var data = JSON.stringify(blogs);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("blogs.json", data);
    response.send(blog);
});
// удаление блога по id
app.delete("/api/blogs/:id", function(request, response){
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
        fs.writeFileSync("blogs.json", data);
        // отправляем удаленный блог
        response.send(blog);
    }
    else response.status(404).send();
});
// изменение блога
app.put("/api/blogs", express.json(), function(request, response){
    if(!request.body) return response.sendStatus(400);

    let blogId = request.body.id;
    let blogName = request.body.name;
    let blogContent = request.body.content;

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
        fs.writeFileSync("blogs.json", data);
        response.send(blog);
    }
    else response.status(404).send(blog);
});

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});