/**
 * Created by zhengjunling on 2017/3/27.
 */
define(["mdeditor"], function (Mdeditor) {
    return Backbone.View.extend({
        initialize: function () {
            var that = this;
            this.template || $.get("/html/about/aboutEdit.html").done(function (data) {
                that.template = data;
                that.render();
            });
        },

        render: function () {
            $(".page").html(this.template);
            this.setElement("#aboutEdit");

            this.mdeditor = new Mdeditor("#aboutEditor");

            this.mdeditor.setOption({
                url: window.App.apiIp + "/admin/about/update",

                uploadUrl: window.App.apiIp + "/admin/upload/imgUpload",

                uploadFieldName: "aboutImgUpload",

                validate: function (content) {
                    if (!$.trim(content)) {
                        alertify.error("内容不能为空");
                        return false;
                    }
                    return true;
                },

                done: function (res) {
                    alertify.log(res.message, res.success ? "success" : "error");
                },

                fail: function () {
                    alertify.error("保存失败，请重试");
                }
            });

            this.getContent();
        },

        /**
         * 初始化文本框的值
         */
        getContent: function () {
            var that = this;

            $.ajax({
                url: window.App.apiIp + "/admin/about/get"
            }).done(function (res) {
                if (res.success) {
                    that.mdeditor.setValue(res.data);
                }
            })
        }
    });
});