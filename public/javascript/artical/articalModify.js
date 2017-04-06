/**
 * Created by zhengjunling on 2017/3/31.
 */
define(["mdeditor"], function (Mdeditor) {
    //动效信息
    var Artical = Backbone.Model.extend({
        urlRoot: window.App.apiIp + "/admin/artical/articalInfo",
        idAttribute: "_id",
        defaults: {
            title: "",
            info: "",
            content: "",
            cover_url: "",
            pageviews: 0
        },

        validate: function (attrs) {
            if (!$.trim(attrs.title)) {
                return "标题不能为空";
            }
            if (!attrs.cover_url) {
                return "请上传封面";
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
            this.template || $.get("/html/artical/articalModify.html").done(function (data) {
                that.template = data;
                that.render(opts);
            });
        },

        render: function (opts) {
            this.articalModel = new Artical();
            this.articalModel.on("reset change", $.proxy(this.renderPage, this));

            this.articalModel.on("invalid", function (model, error) {
                alertify.error(error);
            });

            if (opts && opts.id) {
                this.articalModel.set({_id: opts.id}, {silent: true});
                this.articalModel.update();
            } else {
                this.renderPage();
            }
        },

        renderPage: function () {
            var that = this;
            $(".page").html(_.template(this.template)($.extend({}, {
                _id: this.articalModel.get("_id") || null
            }, this.articalModel.attributes)));
            this.setElement("#articalModify");

            this.$title = this.$("[name=title]");

            this.mdeditor = new Mdeditor("#articalContentEditor");

            this.mdeditor.setOption({
                uploadUrl: window.App.apiIp + "/admin/upload/fileUpload",
                change: function (content) {
                    that.articalModel.set({content: content}, {silent: true});
                },

                submit: function () {
                    that.articalModel.save(that.articalModel.attributes, {
                        success: function () {
                            alertify.success("保存成功");
                            window.location.href = "#articalManage";
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
            }).setValue(this.articalModel.get("content"));

            this.initUpload();
        },

        /**
         * 初始化封面上传
         */
        initUpload: function () {
            var that = this;
            this.$("[name=articalCover]").fileupload({
                url: window.App.apiIp + "/admin/upload/fileUpload",
                formData: {
                    name: "articalCover",
                    type: "gif,jpeg,jpg,png,bmp"
                },
                done: function (t, result) {
                    var res = result.result;
                    if (res.success) {
                        alertify.success(res.message);
                        that.articalModel.set("cover_url", res.data.url);
                    } else {
                        alertify.error(res.message);
                    }
                }
            });
        },

        titleChange: function () {
            this.articalModel.set({title: this.$title.val()}, {silent: true});
        }
    });
});