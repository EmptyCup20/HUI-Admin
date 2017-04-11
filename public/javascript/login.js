/**
 * Created by zhengjunling on 2017/4/7.
 */
;(function ($) {
    "use strict";
    $(function () {
        $(document).on("keypress", function (e) {
            if (e.keyCode === 13) {
                $("#loginSubmit").click();
            }
        });

        $("#loginSubmit").on("click", function () {
            var formData = {
                username: $("[name=username]").val(),
                password: $("[name=password]").val()
            };
            if (!formData.username) {
                alertify.error("请输入用户名");
                return;
            }
            if (!formData.password) {
                alertify.error("请输入密码");
                return;
            }
            $.ajax({
                url: "http://10.20.134.30:7080/admin/signin",
                method: "POST",
                data: formData
            }).done(function (data) {
                if (data.success) {
                    addCookie("accessToken", data.token, 15 * 24);
                    window.location.href = "/";
                } else {
                    alert(data.message);
                }
            });
        })
    })


})(jQuery);