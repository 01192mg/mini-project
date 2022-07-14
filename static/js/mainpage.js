$(document).ready(function () {
    listing()
})


function open_edit_box() {
    console.log("start open_edit_box")
    $("#myin_modal").modal('hide');
    $('#editmodal').modal('show')
}

function open_box() {
    $('#mymodal').modal('show')
}

function in_modal(id) {

    $.ajax({
        type: 'GET',
        url: `/post/${id}`,
        data: {},
        success: function (response) {
            $("#mymodalbox").empty()
            let post = response["post"]
            let username = response["user"]["username"];
            let temp_html = ``
            if (post["username"] == username) {

                temp_html = `
<div class="modal" id="myin_modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="in_title" id="in_modaltitle">${post['title']}</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <img class="in_image" id="in_modalimage" src="${post['image']}" width="400px" height="400px">
                        <p class="in_text" id="in_modaltext">${post['description']}</p>
                    </div>
                        <button class="button"
                               onclick="form_edit_post('${post['title']}, ${post['description']}, ${post['image']}')">
                                수정하기<span class="icon is-small"><i class="fa fa-pencil"
                                aria-hidden="true"></i></span>
                        </button>
                        <button class="button"
                               onclick="delete_post('${id}')">
                                삭제하기<span class="icon is-small"><i class="fa fa-pencil"
                                aria-hidden="true"></i></span>
                        </button>
                </div>
            </div>
        </div>
`;
            } else {
                temp_html = `<div class="modal" id="myin_modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="in_title" id="in_modaltitle">${post['title']}</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <img class="in_image" id="in_modalimage" src="${post['image']}" width="400px" height="400px">
                        <p class="in_text" id="in_modaltext">${post['description']}</p>
                    </div>
                </div>
            </div>
        </div>`
            }
            $('#mymodalbox').append(temp_html)
            $("#myin_modal").modal('show');

        }
    })
}

function form_edit_post(title, description, image) {
    document.getElementById("edit_title").value = title;
    document.getElementById("edit_content").value = description;
    document.getElementById("edit_img_url").value = image;
    open_edit_box();
}

function edit_post(post) {

}

function delete_post(id) {
    $.ajax({
        type: 'DELETE',
        url: `/post/${id}`,
        data: {},
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    })
}


function save_post() {
    let title = $('#u_title').val()
    let description = $('#u_content').val()
    let image = $('#img-url').val()
    let today = new Date().toISOString()

    $.ajax({
        type: "POST",
        url: `post`,
        data: {
            title_give: title,
            description_give: description,
            image_give: image,
            date_give: today
        },
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}

function listing() {
    $.ajax({
        type: 'GET',
        url: `/posts`,
        data: {},
        success: function (response) {
            console.log(response)
            let rows = response['posts']
            for (let i = 0; i < rows.length; i++) {
                let username = rows[i]['username']
                let image = rows[i]['image']

                let id = rows[i]['_id']
                let temp_html = `<div class="card-list">
                                    <h5 class="name">${username}</h5>
                                    <button type="button" class="list" onclick="in_modal('${id}')"><img src='${image}'width="400" height="400"></button>                                </div>`
                $('.cards-box').append(temp_html)
            }
        }
    })
}


function logout() {
    $.removeCookie('mytoken', {path: '/'});
    alert('로그아웃!')
    window.location.href = '/'
}


