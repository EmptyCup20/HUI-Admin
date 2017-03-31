/**
 * Created by zhengjunling on 2016/12/9.
 */
define(["fileupload"], function () {
    var $doc = $(document);

    //图标库基本信息
    var Collection = Backbone.Model.extend({
        urlRoot: window.App.apiIp + "/admin/iconCollection/getIconCollectionInfo",
        idAttribute: "_id",
        defaults: {
            name: "",
            type: null,
            attachment_url: "",
            attachment_name: ""
        },

        update: function () {
            this.fetch({
                reset: true
            });
        }
    });

    //图标模型
    var Icon = Backbone.Model.extend({
        defaults: {
            _id: "",
            collection_id: "",
            name: "",
            svgXML: "",
            tags: "",
            type: null,
            url: ""
        }
    });

    //图标库模型
    var IconCollection = Backbone.Collection.extend({
        model: Icon,
        url: window.App.apiIp + "/admin/icon/getIconsByCollection",
        collectionId: null,
        //保持集合数据与服务端同步
        update: function () {
            this.fetch({
                reset: true,
                data: {
                    id: this.collectionId
                }
            });
            return this;
        }
    });

    return Backbone.View.extend({
        events: {
            "click [data-action=delIcon]": "iconDel",//删除图标
            "click [data-action=collectionInfoSet]": "collectionInfoSet",//图标库基本信息编辑
            "click .icon-preview": "iconSelect"//图标选择
        },

        collectionModel: null,//图标库基本信息
        iconCollection: null,//图标集合

        modalTemp: '<form class="form-horizontal" id="collectionEditForm">' +
        '<input type="hidden" name="_id" value="<%= _id %>">' +
        '<div class="form-group">' +
        '<label class="control-label col-md-3">名称</label>' +
        '<div class="col-md-6">' +
        '<input class="form-control" type="text" name="name" value="<%= name %>">' +
        '</div>' +
        '</div>' +
        '</form>',

        initialize: function (opts) {
            var that = this;
            this.template || $.get("/html/icon/iconCollectionEdit.html").done(function (data) {
                that.template = data;
                that.render(opts);
            });
        },

        render: function (opts) {
            this.collectionModel = new Collection();
            this.iconCollection = new IconCollection();
            this.iconCollection.collectionId = opts.id;

            this.collectionModel.set({_id: opts.id}, {silent: true});
            this.collectionModel.update();
            this.iconCollection.update();

            this.collectionModel.on("reset change", $.proxy(this.renderPage, this));
            this.iconCollection.on("reset", $.proxy(this.renderPage, this));
        },

        renderPage: function () {
            $(".page").html(_.template(this.template)($.extend({
                icons: this.iconCollection.toJSON()
            }, this.collectionModel.attributes)));
            this.setElement("#collectionEdit");
            this.iconCollection.length ? this.$("#dragZone").hide() : this.$("#dragZone").show();
            this.$modifyModal = this.$("#collectionInfoSet");
            this.initFileupload();
            this.initModal();
            this.checkSelectLen();
        },

        /**
         * 上传控件初始化
         */
        initFileupload: function () {
            var that = this;
            var newIcons = [];
            var $dragzone = this.$("#dragZone").on("dragleave drop", function () {
                $(this).removeClass("dragover");
            });
            var formData = {
                name: "iconFile",
                type: this.collectionModel.get("type"),
                collection_id: this.collectionModel.get("_id")
            };
            //图标上传
            this.$("#iconUpload").fileupload({
                url: window.App.apiIp + "/admin/upload/iconUpload",
                formData: formData,
                singleFileUploads: false,
                dropZone: $dragzone,
                pasteZone: $doc,
                dragover: function () {
                    $dragzone.addClass("dragover");
                },
                add: function (e, data) {
                    if (e.isDefaultPrevented()) return false;
                    var typeReg = formData.type == "0" ? /(\.|\/)(svg)$/i : /(\.|\/)(png)$/i;
                    return data.originalFiles[0].name && !typeReg.test(data.originalFiles[0].name) ?
                        (alertify.error("只允许上传" + (formData.type == "0" ? "svg" : "png") + "格式文件"), false) :
                        void((data.autoUpload ||
                        data.autoUpload !== false &&
                        $(this).fileupload("option", "autoUpload")) &&
                        data.process().done(function () {
                            data.submit()
                        }))
                },
                start: function () {
                    newIcons = [];
                    console.log("正在上传。。。");
                },
                always: function (t, result) {
                    var res = result.result;
                    if (res.success) {
                        alertify.success(res.message);
                        that.iconCollection.update();
                    } else {
                        alertify.error(res.message);
                    }
                }
            });
            //psd附件上传
            this.$("[name=psdFile]").fileupload({
                url: window.App.apiIp + "/admin/iconCollection/uploadAttachment",
                formData: {
                    name: "psdFile",
                    type: "psd",
                    collection_id: formData.collection_id
                },
                done: function (t, result) {
                    var res = result.result;
                    if (res.success) {
                        alertify.success(res.message);
                        that.collectionModel.set(res.data);
                    } else {
                        alertify.error(res.message);
                    }
                }
            });
        },

        /**
         * 初始化弹框
         */
        initModal: function () {
            var that = this;
            this.$modifyModal.bsmodel({
                title: "编辑图标库",
                content: _.template(this.modalTemp)(this.collectionModel.attributes),
                ok: "保存"
            }).on("submit.bs.modal", function (e) {
                that.collectionEditSubmit();
            });
        },

        /**
         * 图标删除
         * @param e
         */
        iconDel: function () {
            var that = this;
            var ids = [];

            this.$(".icon-list-box .selected").each(function () {
                ids.push($(this).data("id"));
            });

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
                        that.iconCollection.update();
                        alertify.success(res.message);
                    }
                })
            });
        },

        /**
         * 图标选择
         * @param e
         */
        iconSelect: function (e) {
            var $target = $(e.currentTarget);
            $target.toggleClass("selected");
            this.checkSelectLen();
        },

        /**
         * 判断是否选中图标，并更新删除按钮状态
         */
        checkSelectLen: function () {
            var $delbtn = this.$("[data-action=delIcon]");
            if (this.$(".icon-list-box .selected").length) {
                $delbtn.removeAttr("disabled");
            } else {
                $delbtn.attr("disabled", "disabled");
            }
        },

        /**
         * 表单信息校验
         * @param formData
         * @returns {boolean}
         */
        validate: function (formData) {
            var $Form = this.$("#collectionEditForm");
            if (!formData._id) return false;
            if (!formData.name) {
                alertify.error("请输入图标库名称");
                $("[name=name]", $Form).focus();
                return false;
            }
            return true;
        },

        /**
         * 提交表单
         */
        collectionEditSubmit: function () {
            var that = this;
            var formData = this.$("#collectionEditForm").serializeJson();
            if (!this.validate(formData)) return;
            $.ajax({
                url: window.App.apiIp + "/admin/iconCollection/updateIconCollection",
                method: "post",
                data: formData
            }).done(function (res) {
                if (res.success) {
                    alertify.success(res.message);
                    that.collectionModel.set(res.data);
                    that.$modifyModal.bsmodel("hide");
                } else {
                    alertify.error(res.message);
                }
            });
        }
    });
});