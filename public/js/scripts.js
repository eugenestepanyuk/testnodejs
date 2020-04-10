const count = document.querySelector(".out");
const url = "/api/blogs";
const api_headers = {
    "Content-Type": "application/json"
};

// Получение всех блогов
async function getBlogs() {
    try {
        const response = await fetch(url);
        if (!response.ok) throw Error('Posts not found');

        const posts = await response.json();
        posts.reverse().forEach(blog => createRow(blog));

        posts.forEach(post => {
            onEdit(post.id);
            onRemove(post.id);
        });

    } catch (error) {
        console.log(error);
    }
}

//Получение одного блога
function getBlog(id) {
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

// async function getBlog(id) {
//     try {
//         const response = await fetch(`${url}/${id}`);
//         if (!response.ok) throw Error('Post not found');
//
//         const post = await response.json();
//         createRow(post);
//     } catch (error) {
//         window.location.href = '/';
//     }
// }

// Добавление блога
function createBlog(blogName, blogContent) {
    fetch(url, {
        headers: api_headers,
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
                    count.insertAdjacentHTML('afterend', createRow(blog));
                    onEdit(blog.id);
                    onRemove(blog.id);
                })
            })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}
// Изменение блога
function editBlog(blogId, blogName, blogContent) {
    fetch(url, {
        headers: api_headers,
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
                    document.querySelector(`#post-${blog.id}`).outerHTML = createRow(blog);
                    onEdit(blog.id);
                    onRemove(blog.id);
                })
            })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

// Удаление блога
function deleteBlog(id) {
    fetch(url + '/' + id, {
        headers: api_headers,
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
// let row = function (blog) {
//     return "<tr data-rowid='" + blog.id + "'><td>" + blog.id + "</td>" +
//         "<td>" + blog.name + "</td> <td>" + blog.content + "</td>" +
//         "<td><button class='editButton btn btn-sm btn-outline-secondary' data-id='" + blog.id + "'>Edit</button> | " +
//         "<button class='removeButton btn btn-sm btn-outline-secondary' data-id='" + blog.id + "'>Remove</button</td></tr>";
// }

function createRow(blog) {
    const $parent = document.querySelector('.out');
    const $form = document.createElement('form');

    $form.id = `post-${blog.id}`;
    $form.innerHTML = `
        <div class="form-group">
            <input class="form-control" name="name" placeholder="Title.." value="${blog.name}" readonly/>
        </div>
        <div class="form-group">
            <textarea class="form-control" name="content" rows="10" placeholder="Content.." readonly>${blog.content}</textarea>
        </div>
        <div class="form-group button-group">
            <button class="editButton btn btn-sm btn-outline-secondary">Edit</button>
            <button class="removeButton btn btn-sm btn-outline-secondary">Remove</button>
        </div>`;

    $parent.appendChild($form);
    return $form;
}

// нажимаем на ссылку Изменить
function onEdit(id) {
    const editButton = document.querySelectorAll(".editButton");
    if(editButton) {
        editButton.forEach(element => {
            element.addEventListener('click', event => {
                if (event.target) {
                    const id = event.target.dataset.id;

                    getBlog(id);
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

                    deleteBlog(id);
                }
            });
        });
    }
}

// загрузка блогов
window.onload = async () => {
    await getBlogs();

    // отправка формы
    document.querySelector('form').onsubmit = (function (e) {
        e.preventDefault();
        let id = this.elements["id"].value;
        let name = this.elements["name"].value;
        let content = this.elements["content"].value;
        if (id == 0)
            createBlog(name, content);
        else
            editBlog(id, name, content);
    });
};