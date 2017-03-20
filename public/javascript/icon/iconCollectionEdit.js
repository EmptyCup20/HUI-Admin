/**
 * Created by zhengjunling on 2016/12/9.
 */
define(["fileupload"], function () {
    return Backbone.View.extend({
        events: {
            "click .icon-del": "iconDel",//删除图标
            "click #saveIconCollectionBtn": "saveIconCollection"
        },

        initialize: function (id) {
            var that = this;
            that.id = id;
            $.get("/html/icon/iconCollectionEdit.html").done(function (data) {
                $(".page").html(data);
                that.setElement("#collectionEdit");
                that.template = that.$("#iconListTemp").html();
                that.initFileupload();
                $.ajax({
                    url: window.App.apiIp + "/admin/iconType/getCollectionInfo",
                    data: {
                        id: id
                    }
                }).done(function (res) {
                    if (res.success) {
                        that.data = res.data;
                        that.render();
                    }
                });

                //$(".page").html(data);
                ////定义视图作用域
                //that.setElement("#collectionEdit");
                //
                //that.collectionId = id;
                //
                //that.form = $("#collectionEditForm", that.$el);
                //
                //that.initFileupload();

            });
        },

        render: function () {
            var that = this;
            that.$("#iconListBox").html(_.template(this.template)({
                icons: this.data.icons
            }));

        },

        /**
         * 上传的图标添加到数据库
         * @param data
         * @returns {EditCollection}
         */
        iconAdd: function (data) {
            var that = this;
            $.ajax({
                url: window.App.apiIp + "/admin/icon/add",
                method: "post",
                data: $.extend({}, data, {
                    type: this.data.type,
                    tags: this.createTags(data),
                    collection_id: this.id
                })
            }).done(function (res) {
                if (res.success) {
                    that.data.icons.push(res.data);
                    that.render();
                    //that.renderIconList(result.data)
                } else {
                    alertify.log(res.message);
                }
            });
            return this;
        },

        /**
         * 自动生成标签
         * @param data
         * @returns {string}
         */
        createTags: function (data) {
            return data.name.split(/_|-|\./).join(",");
        },

        /**
         * 上传控件初始化
         */
        initFileupload: function () {
            var that = this;
            //图标上传
            $("#iconUpload").fileupload({
                url: window.App.apiIp + "/admin/upload/imgUpload",
                formData: {
                    name: "iconFile",
                    type: "png,svg"
                },
                start: function (data) {
                    console.log(data);
                },
                done: function (t, result) {
                    if (result.result.success) {
                        var data = result.result.data;
                        that.iconAdd(data);
                    }
                    else {
                        alert(result.result.message);
                    }
                }
            });
            //var that = this;
            ////psd附件上传
            //$("#attachmentUpload").fileupload({
            //    url: window.App.apiIp + "/admin/upload/imgUpload",
            //    formData: {
            //        name: "attachment",
            //        type: "png,jpg,psd,zip"
            //    },
            //    done: function (t, result) {
            //        var data = result.result;
            //        if (data.success) {
            //            $("[name=attachment]", that.form).text(data.data.url);
            //        } else {
            //            alert(data.message);
            //        }
            //    }
            //});
            //
            ////图标上传
            //$("#iconUpload").fileupload({
            //    url: window.App.apiIp + "/admin/upload/imgUpload",
            //    formData: {
            //        name: "iconFile",
            //        type: "png,jpg,svg"
            //    },
            //    done: function (t, result) {
            //        if (result.result.success) {
            //            var data = result.result.data;
            //            that.iconAdd(data);
            //        }
            //        else {
            //            alert(result.result.message);
            //        }
            //    }
            //});
        },

        createTags: function (data) {
            return data.name.split(/_|-|\./).join(",");
        },

        ///**
        // * 图标上传后预览
        // * @param data
        // */
        //renderIconList: function (data) {
        //    $("<div class='col-lg-1 col-md-2 col-sm-4 icon-preview-wrap' data-id='" + data._id + "'>" +
        //        "<div class='icon-preview'>" +
        //        "<img src=" + data.url + ">" +
        //        "<span class='icon-title'>" + data.name + "</span>" +
        //        "<div class='icon-del'><i class='glyphicon glyphicon-trash'></i></div>" +
        //        "</div>" +
        //        "</div>").appendTo("#iconListBox");
        //},

        /**
         * 图标删除
         * @param e
         */
        iconDel: function (e) {
            var $this = $(e.currentTarget);
            var parent = $this.parents(".icon-preview-wrap");
            var id = parent.attr("data-id");
            $.ajax({
                url: window.App.apiIp + "/admin/icon/del",
                method: "post",
                data: {
                    id: id
                }
            }).done(function (data) {
                if (data.success) {
                    alert(data.message);
                    parent.remove();
                }
            })
        },
        /**
         * 图片集添加
         */
        saveIconCollection: function () {
            var formData = $("#collectionEditForm").serializeJson();
            //这里type=file的赋值有点不对，先这么处理
            formData.attachmentUrl = $("[name=attachment]", this.form).text();
            $.ajax({
                url: window.App.apiIp + "/admin/iconType/updateIconCollection",
                method: "post",
                data: {
                    collection: JSON.stringify(formData)
                }
            }).done(function (data) {
                alert(data.message);
                //if (data.success) {
                //    window.location.href = "#iconManage";
                //}
            })
        }
    });
});