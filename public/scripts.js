let count = document.querySelector(".out");
const url = "/api/blogs";

// Получение всех блогов
function GetBlogs() {
    fetch(url)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                response.json().then(function (blogs) {
                    let rows = "";
                    blogs.forEach(blog => rows += row(blog));
                    count.innerHTML = rows;
                });
            })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

// Получение одного блога
function GetBlog(id) {
    fetch(url + '/' + id)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                response.json().then(function (blog) {
                            let form = document.forms["blogForm"];
                            form.elements["id"].value = blog.id;
                            form.elements["name"].value = blog.name;
                            form.elements["content"].value = blog.content;
                        })
            })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

// Добавление блога
function CreateBlog(blogName, blogContent) {
    fetch(url, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            name: blogName,
            content: blogContent
        })
    })
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                response.json().then(function (blog) {
                    reset();
                    count.insertAdjacentHTML('afterend', row(blog));
                })
            })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}
// Изменение блога
function EditBlog(blogId, blogName, blogContent) {
    fetch(url,{
        headers: {
            "Content-Type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify({
            id: blogId,
            name: blogName,
            content: blogContent
        })
    })
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                response.json().then(function (blog) {
                    reset();
                    document.querySelector("tr[data-rowid='" + blog.id + "']").outerHTML = row(blog);
                })
            })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

// Удаление блога
function DeleteBlog(id) {
    fetch(url + '/' + id,{
        headers: {
            "Content-Type": "application/json"
        },
        method: "DELETE",
    })
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                response.json().then(function (blog) {
                    console.log(blog);
                    document.querySelector("tr[data-rowid='" + blog.id + "']").remove();
                })
            })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

// сброс формы
function reset() {
    let form = document.forms["blogForm"];
    form.reset();
    form.elements["id"].value = 0;
}

// создание строки для таблицы
let row = function (blog) {
    return "<tr data-rowid='" + blog.id + "'><td>" + blog.id + "</td>" +
        "<td>" + blog.name + "</td> <td>" + blog.content + "</td>" +
        "<td><a class='editLink' data-id='" + blog.id + "'>Изменить</a> | " +
        "<a class='removeLink' data-id='" + blog.id + "'>Удалить</a></td></tr>";
}

// сброс значений формы
document.querySelector('#reset').addEventListener('click', (e) => {
    e.preventDefault();
    reset();
});

// отправка формы
document.querySelector('form').onsubmit = (function (e) {
    e.preventDefault();
    let id = this.elements["id"].value;
    let name = this.elements["name"].value;
    let content = this.elements["content"].value;
    if (id == 0)
        CreateBlog(name, content);
    else
        EditBlog(id, name, content);
});

// нажимаем на ссылку Изменить
// $("body").on("click", ".editLink", function () {
//     var id = $(this).data("id");
//     GetBlog(id);
// })
const elements = document.querySelectorAll('.editLink');

elements.forEach(element => {
    element.addEventListener('click', event => {
        if (event.target) {
            const id = event.target.dataset.id;

            GetBlog(id);
        }
    });
});


// нажимаем на ссылку Удалить
$("body").on("click", ".removeLink", function () {
    let id = $(this).data("id");
    DeleteBlog(id);
});

// загрузка блогов
window.onload = () =>{
    GetBlogs();
};