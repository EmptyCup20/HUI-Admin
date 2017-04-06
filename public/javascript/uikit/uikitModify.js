/**
 * Created by zhengjunling on 2017/3/27.
 */
define(["mdeditor"], function (Mdeditor) {
    return Backbone.View.extend({
        initialize: function () {
            var that = this;
            this.template || $.get("/html/uikit/uikitModify.html").done(function (data) {
                that.template = data;
                that.render();
            });
        },

        render: function () {
            $(".page").html(this.template);
            this.setElement("#uikitModify");

            this.mdeditor = new Mdeditor("#uikitEditor");

            this.mdeditor.setOption({
                url: window.App.apiIp + "/admin/uikit/modify",

                uploadUrl: window.App.apiIp + "/admin/upload/fileUpload",

                uploadFieldName: "uikitImgUpload",

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
                url: window.App.apiIp + "/admin/uikit/getContent"
            }).done(function (res) {
                if (res.success) {
                    that.mdeditor.setValue(res.data);
                }
            })
        }
    });
});