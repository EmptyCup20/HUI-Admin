/**
 *
 * @Author zhangxin14
 * @Date   2016/12/9
 *
 */
define(["mdeditor"], function (Mdeditor) {
    return Backbone.View.extend({
        initialize: function (opts) {
            var that = this;
            this.template || $.get("/html/design/designModify.html").done(function (data) {
                that.template = data;
                that.render(opts);
            });
        },

        render: function (opts) {
            var designName = "";
            this.type = opts.type;
            switch (this.type) {
                case "mobile":
                    designName = "移动端";
                    break;
                case "web":
                    designName = "web";
                    break;
                case "largeScreen":
                    designName = "大屏";
                    break;
            }
            $(".page").html(_.template(this.template)({
                designName: designName
            }));
            this.setElement("#designModify");

            this.mdeditor = new Mdeditor("#designEditor");

            this.mdeditor.setOption({
                url: window.App.apiIp + "/admin/design/modify",

                formData: {
                    type: this.type
                },

                uploadUrl: window.App.apiIp + "/admin/upload/fileUpload",

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
                url: window.App.apiIp + "/admin/design/" + this.type
            }).done(function (res) {
                if (res.success) {
                    that.mdeditor.setValue(res.data && res.data.content || "");
                }
            })
        }
    });
});