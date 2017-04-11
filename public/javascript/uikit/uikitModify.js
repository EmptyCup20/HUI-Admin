/**
 * Created by zhengjunling on 2017/3/27.
 */
define(["mdeditor"], function (Mdeditor) {
    //动效信息
    var Uikit = Backbone.Model.extend({
        urlRoot: window.App.apiIp + "/admin/uikit",
        defaults: {
            content: "",
            attachment_url: null,
            attachment_name: null
        },

        validate: function (attrs) {
            if (!$.trim(attrs.content)) {
                return "内容不能为空";
            }
        },

        update: function () {
            this.fetch({
                reset: true
            });
        }
    });

    return Backbone.View.extend({
        initialize: function () {
            var that = this;
            this.template || $.get("/html/uikit/uikitModify.html").done(function (data) {
                that.template = data;
                that.render();
            });
        },

        render: function () {
            this.model = new Uikit();

            this.model.on("reset change", $.proxy(this.renderPage, this));

            this.model.on("invalid", function (model, error) {
                alertify.error(error);
            });

            this.model.update();
        },

        renderPage: function () {
            var that = this;
            $(".page").html(_.template(this.template)(this.model.attributes));
            this.setElement("#uikitModify");

            this.mdeditor = new Mdeditor("#uikitEditor");

            this.mdeditor.setOption({
                uploadUrl: window.App.apiIp + "/admin/upload/fileUpload",
                change: function (content) {
                    that.model.set({content: content}, {silent: true});
                },

                submit: function () {
                    that.model.save(that.model.attributes, {
                        success: function () {
                            alertify.success("保存成功");
                        },
                        error: function () {
                            alertify.error("保存失败，请重试！");
                        }
                    });
                },

                done: function (res) {
                    alertify.log(res.message, res.success ? "success" : "error");
                },

                fail: function () {
                    alertify.error("保存失败，请重试");
                }
            }).setValue(this.model.get("content"));

            //this.getContent();
            this.initUpload();
        },

        initUpload: function () {
            var that = this;
            //附件上传
            this.$("[name=attachmentFile]").fileupload({
                url: window.App.apiIp + "/admin/upload/fileUpload",
                formData: {
                    name: "attachmentFile"
                },
                done: function (t, result) {
                    var res = result.result;
                    if (res.success) {
                        alertify.success(res.message);
                        that.model.set({
                            attachment_url: res.data.downloadUrl,
                            attachment_name: res.data.name
                        });
                    } else {
                        alertify.error(res.message);
                    }
                }
            });
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