function open_box() {
    $("#mymodal").show();
}

function close_box() {
    $("#mymodal").hide();
}

function save_post() {

        $.ajax({
            type: "POST",
            url: `post`,
            data: {
                title_give: '{{ word }}',
                description_give: '{{ description }}',
                img_give: '{{ img }}'
            },
            success: function (response) {
                alert(response["msg"])
                window.location.reload()
            }
        });
}

function sign_out() {
    $.removeCookie('mytoken', {path: '/'});
    alert('로그아웃!')
    window.location.href = "/login"
}