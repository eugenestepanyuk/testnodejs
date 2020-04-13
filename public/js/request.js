const count = document.querySelector('.out');
const API_POSTS = '/api/posts';
const API_HEADERS = {
    'Content-Type': 'application/json'
};

// Получение всех блогов
async function getPosts() {
    try {
        const response = await fetch(API_POSTS);
        if (!response.ok) throw Error('Posts not found');

        const posts = await response.json();
        posts.reverse().forEach(post => createNewPost(post));

        posts.forEach(post => {
            onEdit(post.id);
            onRemove(post.id);
        });

    } catch (error) {
        console.log(error);
    }
}

//Получение одного блога
function getPost(id) {
    fetch(API_POSTS + '/' + id)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                response.json().then(function (post) {
                    let form = document.forms['postForm'];
                    form.elements['id'].value = post.id;
                    form.elements['name'].value = post.name;
                    form.elements['content'].value = post.content;
                })
            })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

// async function getPost(id) {
//     try {
//         const response = await fetch(`${API_POSTS}/${id}`);
//         if (!response.ok) throw Error('Post not found');
//
//         const post = await response.json();
//         createNewPost(post);
//     } catch (error) {
//         window.location.href = '/';
//     }
// }

// Добавление блога
function createPost(postName, postContent) {
    fetch(API_POSTS, {
        headers: API_HEADERS,
        method: "POST",
        body: JSON.stringify({
            name: postName,
            content: postContent
        })
    })
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                response.json().then(function (post) {
                    reset();
                    count.insertAdjacentHTML('afterend', createNewPost(post));
                    onEdit(post.id);
                    onRemove(post.id);
                })
            })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}
// Изменение блога
// function editPost(postId, postName, postContent) {
// //     fetch(API_POSTS, {
// //         headers: API_HEADERS,
// //         method: "PUT",
// //         body: JSON.stringify({
// //             id: postId,
// //             name: postName,
// //             content: postContent
// //         })
// //     })
// //         .then(
// //             function (response) {
// //                 if (response.status !== 200) {
// //                     console.log('Looks like there was a problem. Status Code: ' + response.status);
// //                     return;
// //                 }
// //                 response.json().then(function (post) {
// //                     reset();
// //                     document.querySelector(`#post-${post.id}`).outerHTML = createNewPost(post);
// //                     onEdit(post.id);
// //                     onRemove(post.id);
// //                 })
// //             })
// //         .catch(function (err) {
// //             console.log('Fetch Error :-S', err);
// //         });
// // }
async function editPost(post) {
    const $post = document.querySelector(`#post-${post.id}`);
    if($post){
        try {
            await fetch(`${API_POSTS}/${post.id}`, {
                method: 'PUT',
                headers: API_HEADERS,
                body: JSON.stringify(post),
            });

            let $post_name = document.querySelector('.input-control');
            let $post_content = document.querySelector('.textarea-control');

            onEdit(post.id);
            onRemove(post.id);

            //window.location.reload();
        } catch (error) {
            console.log(error);
        }

    }
}

// Удаление блога
function deletePost(id) {
    fetch(API_POSTS + '/' + id, {
        headers: API_HEADERS,
        method: 'DELETE',
    })
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                response.json().then(function (post) {
                    document.querySelector(`#post-${post.id}`).remove();
                    onEdit(post.id);
                    onRemove(post.id);
                })
            })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

// сброс формы
function reset() {
    let form = document.forms['postForm'];
    form.reset();
    form.elements['id'].value = 0;
}

// создание нового поста
function createNewPost(post) {
    const $parent = document.querySelector('.out');
    const $form = document.createElement('form');

    $form.id = `post-${post.id}`;
    $form.innerHTML = `
        <div class="form-group">
            <input class="form-control input-control" name="name" placeholder="Title.." value="${post.name}"/>
        </div>
        <div class="form-group">
            <textarea class="form-control textarea-control" name="content" rows="10" placeholder="Content..">${post.content}</textarea>
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
    const editButton = document.querySelectorAll('.editButton');
    if(editButton) {
        editButton.forEach(element => {
            element.addEventListener('click', event => {
                if (event.target) {
                    const id = event.target.dataset.id;

                    getPost(id);
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

                    deletePost(id);
                }
            });
        });
    }
}

// загрузка блогов
window.onload = async () => {
    await getPosts();

    // отправка формы
    document.querySelector('form').onsubmit = (function (e) {
        e.preventDefault();
        let id = this.elements['id'].value;
        let name = this.elements['name'].value;
        let content = this.elements['content'].value;
        if (id == 0)
            createPost(name, content);
        else
            editPost(id, name, content);
    });
};