/**
 * Created by zhengjunling on 2016/12/9.
 */
define(["fileupload"], function () {
    var $doc = $($(document));
    var Icon = Backbone.Model.extend({
        defaults: {
            _id: "",
            collection_id: "",
            downloadUrl: "",
            name: "",
            svgXML: "",
            tags: "",
            type: null,
            url: ""
        }
    });

    var IconCollection = Backbone.Collection.extend({
        model: Icon
    });

    return Backbone.View.extend({
        events: {
            "click [data-action=delIcon]": "iconDel",//删除图标
            "click #saveIconCollectionBtn": "saveIconCollection",
            "click [data-action=collectionInfoSet]": "collectionInfoSet",
            "click .icon-preview": "iconSelect"
        },

        iconCollection: new IconCollection,

        initialize: function (opts) {
            var that = this;
            this.template || $.get("/html/icon/iconCollectionEdit.html").done(function (data) {
                that.template = data;
                that.render(opts);
            });

            this.iconCollection.on("all", function (e) {
                that.renderIconList();
            });
        },

        render: function (opts) {
            var that = this;
            $(".page").html(this.template);
            this.setElement("#collectionEdit");
            this.iconListTemp = this.$("#iconListTemp").html();
            this.initFileupload();
            $("#collectionInfoSet").bsmodel({
                title: "编辑图标库",
                content: "测试"
            }).on("submit.bs.modal", function (e) {
            });
            $.ajax({
                url: window.App.apiIp + "/admin/iconType/getCollectionInfo",
                data: {
                    id: opts.id
                }
            }).done(function (res) {
                if (res.success) {
                    that.collectionInfo = res.data;
                    that.iconCollection.reset(res.data.icons);
                }
            });
        },

        /**
         * 渲染图标列表
         */
        renderIconList: function () {
            var $dragzone = $("#dragZone");
            this.$("#iconListBox").html(_.template(this.iconListTemp)({
                icons: this.iconCollection.toJSON()
            }));
            this.iconCollection.length ? $dragzone.hide() : $dragzone.show();
            return this;
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
                    type: this.collectionInfo.type,
                    tags: this.createTags(data),
                    collection_id: this.collectionInfo._id
                })
            }).done(function (res) {
                res.success ? that.iconCollection.add(res.data) : alertify.log(res.message);
            });
            return this;
        },

        /**
         * 图标删除
         * @param e
         */
        iconDel: function () {
            var that = this;
            var ids = this.getSelectedIds();
            if (!ids.length) {
                alertify.alert("请先选择要删除的图标");
                return;
            }
            alertify.confirm("确定删除图标？", function (e) {
                e && $.ajax({
                    url: window.App.apiIp + "/admin/icon/del",
                    method: "post",
                    traditional: true,
                    data: {
                        ids: ids
                    }
                }).done(function (res) {
                    if (res.success) {
                        ids.forEach(function (e) {
                            that.iconCollection.remove(that.iconCollection.findWhere({_id: e}));
                        });
                    }
                })
            });
        },

        getSelectedIds: function () {
            var ids = [];
            this.$(".icon-list-box .selected").each(function () {
                ids.push($(this).data("id"));
            });
            return ids;
        },

        iconSelect: function (e) {
            var $target = $(e.currentTarget);
            $target.toggleClass("selected");
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
                dropZone: $("#dragZone"),
                pasteZone: $doc,
                dragover: function () {
                },
                add: function (e, data) {
                    if (e.isDefaultPrevented()) return false;
                    var typeReg = /(\.|\/)(svg|png)$/i;
                    return data.originalFiles[0].name && !typeReg.test(data.originalFiles[0].name) ? (alertify.error("只允许上传svg和png格式"), false) : void((data.autoUpload || data.autoUpload !== false && $(this).fileupload("option", "autoUpload")) && data.process().done(function () {
                        data.submit()
                    }))
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
        },

        createTags: function (data) {
            return data.name.split(/_|-|\./).join(",");
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