$(document).ready(function () {
    listing();
});


function open_box() {
    $("#mymodal").show();
}

function close_box() {
    $("#mymodal").hide();
}

function in_modal(id) {
    $("#myin_modal").show();
    $(".modal-content").empty()
    $.ajax({
        type: 'GET',
        url: `/post/${id}`,
        data: {},
        success: function (response) {
            let post = response["post"]
            let username = response["user"]["username"];
            let temp_html = ``
            if (post["username"] == username) {
                temp_html = `<div class="modal-header">
                                            <h4 class="in_title" id="in_modaltitle">${post['title']}</h4>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                                    onclick="close_inmodal()"></button>
                                        </div>
                                        <div class="modal-body">
                                            <img class="in_image" id="in_modalimage" src="${post['image']}" width="400px" height="400px">
                                            <p class="in_text" id="in_modaltext">${post['description']}</p>
                                        </div>
                                            <button class="button"
                                                   onclick="delete_post('${id}')">
                                                    삭제하기<span class="icon is-small"><i class="fa fa-pencil"
                                                    aria-hidden="true"></i></span>
                                            </button>`;
            } else {
                temp_html = `<div class="modal-header">
                                            <h4 class="in_title" id="in_modaltitle">${post['title']}</h4>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                                    onclick="close_inmodal()"></button>
                                        </div>
                                        <div class="modal-body">
                                            <img class="in_image" id="in_modalimage" src="${post['image']}" width="400px" height="400px">
                                            <p class="in_text" id="in_modaltext">${post['description']}</p>
                                        </div>`
            }
            $('.modal-content').append(temp_html)

        }
    })
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

function close_inmodal() {
    $("#myin_modal").hide();
}


function save_post() {
    let title = $('#u_title').val()
    let description = $('#u_content').val()
    let image = $('#img-url').val()

    $.ajax({
        type: "POST",
        url: `post`,
        data: {
            title_give: title,
            description_give: description,
            image_give: image
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


