function login() {
    let username = $("#input-id").val()
    let password = $("#input-password").val()

    if (username == "") {
        alert("아이디를 입력해주세요.")
        $("#input-id").focus()
        return;
    }

    if (password == "") {
        alert("비밀번호를 입력해주세요.")
        $("#input-password").focus()
        return;
    }

    $.ajax({
        type: "POST",
        url: "/sign_in",
        data: {
            username_give: username,
            password_give: password
        },
        success: function (response) {
            if (response['result'] == 'success') {
                $.cookie('mytoken', response['token'], {path: '/'});
                window.location.replace("/")
            } else {
                alert(response['msg'])
            }
        }
    });
}


