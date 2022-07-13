$(document).ready(function () {
    listing();
});


function open_box() {
    $("#mymodal").show();
}

function close_box() {
    $("#mymodal").hide();
}

function in_modal() {
    $("#myin_modal").show();
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
        url: `/get_posts`,
        data: {},
        success: function (response) {
            console.log(response)
            let rows = response['posts']
            for (let i = 0; i < rows.length; i++) {
                let username = rows[i]['username']
                let image = rows[i]['image']
                let temp_html = `<div class="card-list">
                                    <h5 class="name">${username}</h5>
                                    <button type="button" class="list" onclick="in_modal()"><img src='${image}'width="400" height="400"></button>
                                </div>`
                $('.cards-box').append(temp_html)
            }
        }
    })
}


function logout() {
    ('mytoken').remove;
    alert('로그아웃!')
    window.location.href = '/login'
}



