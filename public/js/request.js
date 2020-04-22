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

        // posts.forEach(post => {
        //     onEdit(post.id);
        //     onRemove(post.id);
        // });
        //return await response.json();
    } catch (error) {
        console.log(error);
    }
}

//Получение одного блога
// function getPost(id) {
//     fetch(API_POSTS + '/' + id)
//         .then(
//             function (response) {
//                 if (response.status !== 200) {
//                     console.log('Looks like there was a problem. Status Code: ' + response.status);
//                     return;
//                 }
//                 response.json().then(function (post) {
//                     let form = document.forms['postForm'];
//                     form.elements['id'].value = post.id;
//                     form.elements['name'].value = post.name;
//                     form.elements['content'].value = post.content;
//                 })
//             })
//         .catch(function (err) {
//             console.log('Fetch Error :-S', err);
//         });
// }
async function getPost(id) {
    try {
        const response = await fetch(`${API_POSTS}/${id}`);
        if (!response.ok) throw Error('Post not found');

        const post = await response.json();
        document.getElementsByName('id').value = post.id;
        document.getElementsByName('name').value = post.name;
        document.getElementsByName('content').value = post.content;

        //return post;
    } catch (error) {
        window.location.href = '/';
    }
}

// Добавление блога
// function createPost(postName, postContent) {
//     fetch(API_POSTS, {
//         headers: API_HEADERS,
//         method: "POST",
//         body: JSON.stringify({
//             name: postName,
//             content: postContent
//         })
//     })
//         .then(
//             function (response) {
//                 if (response.status !== 200) {
//                     console.log('Looks like there was a problem. Status Code: ' + response.status);
//                     return;
//                 }
//                 response.json().then(function (post) {
//                     reset();
//                     count.insertAdjacentHTML('afterend', createNewPost(post));
//                     onEdit(post.id);
//                     onRemove(post.id);
//                 })
//             })
//         .catch(function (err) {
//             console.log('Fetch Error :-S', err);
//         });
// }
async function createPost(post) {
    try {
        const response = await fetch(API_POSTS, {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify(post),
        });
        if (!response.ok) throw Error('Post was not created');
        document.querySelector('.btn-save').addEventListener('click', () => createNewPost(post));
    } catch (error) {
        console.log(error);
    }
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
    try {
        const response = await fetch(`${API_POSTS}/${post.id}`, {
            method: 'PUT',
            headers: API_HEADERS,
            body: JSON.stringify(post),
        });
        if (!response.ok) throw Error(`Post with ${post.id} ID was not updated`);

        const $post = document.querySelector(`#post-${post.id}`);
        if($post) {
            document.querySelector('.input-control').value = $post.name;
            document.querySelector('.textarea-control').value = $post.content;
        }
    } catch (error) {
        console.log(error);
    }
}

// Удаление блога
// function removePost(id) {
//     fetch(API_POSTS + '/' + id, {
//         headers: API_HEADERS,
//         method: 'DELETE',
//     })
//         .then(
//             function (response) {
//                 if (response.status !== 200) {
//                     console.log('Looks like there was a problem. Status Code: ' + response.status);
//                     return;
//                 }
//                 response.json().then(function (post) {
//                     document.querySelector(`#post-${post.id}`).remove();
//                     onEdit(post.id);
//                     onRemove(post.id);
//                 })
//             })
//         .catch(function (err) {
//             console.log('Fetch Error :-S', err);
//         });
// }
async function removePost(id) {
    try {
        const response = await fetch(`${API_POSTS}/${id}`, {
            method: 'DELETE',
            headers: API_HEADERS
        });
        if (!response.ok) throw Error(`Post with ${id} ID was not deleted`);
        document.querySelector(`#post-${id}`).remove();
    } catch (error) {
        console.log(error);
    }
}

// сброс формы
function reset() {
    let form = document.forms['postForm'];
    form.reset();
    form.elements['id'].value = 0;
}

// создание нового поста
// function createNewPost(post) {
//     const $parent = document.querySelector('.out');
//     const $form = document.createElement('form');
//
//     $form.id = `post-${post.id}`;
//     $form.innerHTML = `
//         <div class="form-group">
//             <input class="form-control input-control" name="name" placeholder="Title.." value="${post.name}"/>
//         </div>
//         <div class="form-group">
//             <textarea class="form-control textarea-control" name="content" rows="10" placeholder="Content..">${post.content}</textarea>
//         </div>
//         <div class="form-group button-group">
//             <button class="editButton btn btn-sm btn-outline-secondary">Edit</button>
//             <button class="removeButton btn btn-sm btn-outline-secondary">Remove</button>
//         </div>`;
//
//     $parent.appendChild($form);
//     return $form;
// }
function createNewPost(post) {
    const $parent = document.querySelector('.out');
    const $post = document.createElement('div');
    const $editButton = document.createElement('button');
    const $removeButton = document.createElement('button');

    $post.id = `post-${post.id}`;
    $post.innerHTML = `
        <div class="form-group">
            <input class="form-control input-control" name="name" placeholder="Title.." value="${post.name}"/>
        </div>
        <div class="form-group">
            <textarea class="form-control textarea-control" name="content" rows="10" placeholder="Content..">${post.content}</textarea>
        </div>
        <div class="form-group button-group"></div>`;

    $editButton.className = 'editButton btn btn-sm btn-outline-secondary';
    $removeButton.className = 'removeButton btn btn-sm btn-outline-secondary';
    $editButton.innerHTML = 'Edit';
    $removeButton.innerHTML = 'Remove';
    $editButton.addEventListener('click', () => editPost(post.id));
    $removeButton.addEventListener('click', async () => {
        if(await removePost(post.id)){
            $post.remove();
        }
    });

    $post.querySelector('.button-group').appendChild($editButton);
    $post.querySelector('.button-group').appendChild($removeButton);
    $parent.appendChild($post);
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

                    removePost(id);
                }
            });
        });
    }
}

// загрузка блогов
window.onload = async () => {
    await getPosts();

    // отправка формы
    document.querySelector('.posts').onsubmit = (function (e) {
        e.preventDefault();
        const id = this.elements['id'].value;
        const name = this.elements['name'].value;
        const content = this.elements['content'].value;
        if (id == 0)
            createPost(name, content);
        else
            editPost(id, name, content);
    });
};