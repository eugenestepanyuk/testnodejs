// Получение всех блогов
function GetBlogs() {
    $.ajax({
        url: "/api/blogs",
        type: "GET",
        contentType: "application/json",
        success: function (blogs) {
            let rows = "";
            $.each(blogs, function (index, blog) {
                // добавляем полученные элементы в таблицу
                rows += row(blog);
            })
            $("table tbody").append(rows);
        }
    });
}
// Получение одного блога
function GetBlog(id) {
    $.ajax({
        url: "/api/blogs/" + id,
        type: "GET",
        contentType: "application/json",
        success: function (blog) {
            let form = document.forms["blogForm"];
            form.elements["id"].value = blog.id;
            form.elements["name"].value = blog.name;
            form.elements["content"].value = blog.content;
        }
    });
}
// Добавление блога
function CreateBlog(blogName, blogContent) {
    $.ajax({
        url: "api/blogs",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            name: blogName,
            content: blogContent
        }),
        success: function (blog) {
            reset();
            $("table tbody").append(row(blog));
        }
    })
}
// Изменение блога
function EditBlog(blogId, blogName, blogContent) {
    $.ajax({
        url: "api/blogs",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: blogId,
            name: blogName,
            content: blogContent
        }),
        success: function (blog) {
            reset();
            $("tr[data-rowid='" + blog.id + "']").replaceWith(row(blog));
        }
    })
}

// сброс формы
function reset() {
    let form = document.forms["blogForm"];
    form.reset();
    form.elements["id"].value = 0;
}

// Удаление блога
function DeleteBlog(id) {
    $.ajax({
        url: "api/blogs/"+id,
        contentType: "application/json",
        method: "DELETE",
        success: function (blog) {
            console.log(blog);
            $("tr[data-rowid='" + blog.id + "']").remove();
        }
    })
}
// создание строки для таблицы
let row = function (blog) {
    return "<tr data-rowid='" + blog.id + "'><td>" + blog.id + "</td>" +
        "<td>" + blog.name + "</td> <td>" + blog.content + "</td>" +
        "<td><a class='editLink' data-id='" + blog.id + "'>Изменить</a> | " +
        "<a class='removeLink' data-id='" + blog.id + "'>Удалить</a></td></tr>";
}
// сброс значений формы
$("#reset").click(function (e) {
    e.preventDefault();
    reset();
})

// отправка формы
$("form").submit(function (e) {
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
$("body").on("click", ".editLink", function () {
    let id = $(this).data("id");
    GetBlog(id);
})
// нажимаем на ссылку Удалить
$("body").on("click", ".removeLink", function () {
    let id = $(this).data("id");
    DeleteBlog(id);
})

// загрузка блогов
GetBlogs();