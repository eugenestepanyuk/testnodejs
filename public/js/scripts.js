const count = document.querySelector(".out");
const url = "/api/blogs";

// Получение всех блогов
async function GetBlogs() {
    try {
        const response = await fetch(url);
        if (!response.ok) throw Error('Posts not found');

        const posts = await response.json();
        let rows = "";
        posts.forEach(blog => rows += row(blog));
        count.innerHTML = rows;

        posts.forEach(post => {
            onEdit(post.id);
            onRemove(post.id);
        });

    } catch (error) {
        console.log(error);
    }
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
                    onEdit(blog.id);
                    onRemove(blog.id);
                })
            })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}
// Изменение блога
function EditBlog(blogId, blogName, blogContent) {
    fetch(url, {
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
                    onEdit(blog.id);
                    onRemove(blog.id);
                })
            })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

// Удаление блога
function DeleteBlog(id) {
    fetch(url + '/' + id, {
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
                    onEdit(blog.id);
                    onRemove(blog.id);
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
        "<td><button class='editButton' data-id='" + blog.id + "'>Изменить</button> | " +
        "<button class='removeButton' data-id='" + blog.id + "'>Удалить</button</td></tr>";
}

// нажимаем на ссылку Изменить
function onEdit(id) {
    const editButton = document.querySelectorAll(".editButton");
    if(editButton) {
        editButton.forEach(element => {
            element.addEventListener('click', event => {
                if (event.target) {
                    const id = event.target.dataset.id;

                    GetBlog(id);
                }
            });
        });
    }
}

// нажимаем на ссылку Удалить
function onRemove(id) {
    const removeButton = document.querySelectorAll('.removeButton');
    if(removeButton)
    {
        removeButton.forEach(element => {
            element.addEventListener('click', event => {
                if (event.target) {
                    const id = event.target.dataset.id;

                    DeleteBlog(id);
                }
            });
        });
    }
}

// загрузка блогов
window.onload = async () => {
    await GetBlogs();

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
};