/**
 * Created by zhengjunling on 2017/3/31.
 */
define(["mdeditor"], function (Mdeditor) {
    //动效信息
    var Animate = Backbone.Model.extend({
        urlRoot: window.App.apiIp + "/admin/animate/animateInfo",
        idAttribute: "_id",
        defaults: {
            title: "",
            cover_img_url: null,
            attachment_url: null,
            attachment_name: null,
            content: ""
        },

        validate: function (attrs) {
            if (!$.trim(attrs.title)) {
                return "标题不能为空";
            }
            if (!attrs.cover_img_url) {
                return "请上传封面";
            }
            if (!attrs.attachment_url) {
                return "请上传附件";
            }
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
        events: {
            "blur [name=title]": "titleChange"
        },
        initialize: function (opts) {
            var that = this;
            this.template || $.get("/html/animate/animateModify.html").done(function (data) {
                that.template = data;
                that.render(opts);
            });
        },

        render: function (opts) {
            this.animateModel = new Animate();
            this.animateModel.on("reset change", $.proxy(this.renderPage, this));

            this.animateModel.on("invalid", function (model, error) {
                alertify.error(error);
            });

            if (opts && opts.id) {
                this.animateModel.set({_id: opts.id}, {silent: true});
                this.animateModel.update();
            } else {
                this.renderPage();
            }
        },

        renderPage: function () {
            var that = this;
            $(".page").html(_.template(this.template)($.extend({}, {
                _id: this.animateModel.get("_id") || null
            }, this.animateModel.attributes)));
            this.setElement("#animateModify");

            this.$title = this.$("[name=title]");

            this.mdeditor = new Mdeditor("#animateContentEditor");

            this.mdeditor.setOption({
                uploadUrl: window.App.apiIp + "/admin/upload/imgUpload",
                change: function (content) {
                    that.animateModel.set({content: content}, {silent: true});
                },

                submit: function () {
                    that.animateModel.save(that.animateModel.attributes, {
                        success: function () {
                            alertify.success("保存成功");
                            window.location.href = "#animateManage";
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
            }).setValue(this.animateModel.get("content"));

            this.initUpload();
        },

        initUpload: function () {
            var that = this;
            //封面上传
            this.$("[name=animateCover]").fileupload({
                url: window.App.apiIp + "/admin/animate/uploadCoverPic",
                formData: {
                    name: "animateCover",
                    type: "gif,jpeg,jpg,png,bmp"
                },
                done: function (t, result) {
                    var res = result.result;
                    if (res.success) {
                        alertify.success(res.message);
                        that.animateModel.set(res.data);
                    } else {
                        alertify.error(res.message);
                    }
                }
            });
            //附件上传
            this.$("[name=attachmentFile]").fileupload({
                url: window.App.apiIp + "/admin/animate/uploadAttachment",
                formData: {
                    name: "attachmentFile"
                },
                done: function (t, result) {
                    var res = result.result;
                    if (res.success) {
                        alertify.success(res.message);
                        that.animateModel.set(res.data);
                    } else {
                        alertify.error(res.message);
                    }
                }
            });
        },

        titleChange: function () {
            this.animateModel.set({title: this.$title.val()}, {silent: true});
        }
    });
});