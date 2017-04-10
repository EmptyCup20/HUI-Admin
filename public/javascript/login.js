/**
 * Created by zhengjunling on 2017/4/7.
 */
;(function ($) {
    $(function () {
        $("#loginSubmit").on("click", function () {
            var formData = {
                username: $("[name=username]").val(),
                password: $("[name=password]").val()
            };
            if (!formData.username) {
                alert("请输入用户名");
                return;
            }
            if (!formData.password) {
                alert("请输入密码");
                return;
            }
            $.ajax({
                url: "http://10.20.134.30:7080/admin/signin",
                method: "POST",
                data: formData
            }).done(function (data) {
                if (data.success) {
                    localStorage.accessToken = data.token;
                    window.location.href = "/";
                } else {
                    alert(data.message);
                }
            });
        })
    })


})(jQuery);