/**
 * Created by zhengjunling on 2016/12/9.
 */
define(function (require) {
    require('bsTable');
    return Backbone.View.extend({
        events: {
            "click [data-action=add]": "addCollection",//新建图标库
            "click [data-action=del]": "delCollection",//删除图标库
            "click [data-action=batchDel]": "delCollection",
            "click #collectionList [data-action=edit]": "editCollection"//编辑图标库
        },

        initialize: function () {
            this.render();
        },

        /**
         * 页面初始化
         */
        render: function () {
            var that = this;
            $.get("/html/icon/collectionManage.html").done(function (data) {
                $(".page").html(data);

                //定义视图作用域
                that.setElement("#iconCollection");


                that.table = $("#collectionList");

                //初始化表格
                that.loadTable();

                var addModalTemp = that.$("#collectionAddModal").html();

                that.$addModal = that.$("#iconCollectionAdd").bsmodel({
                    title: "新建图标库",
                    content: addModalTemp,
                    ok: "添加"
                }).on("submit.bs.modal", function () {
                    that.collectionAddSubmit();
                });
            })
        },

        /**
         * 初始化表格
         */
        loadTable: function () {
            this.table.bootstrapTable({
                url: window.App.apiIp + "/admin/iconCollection/getIconCollection",
                queryParams: function (params) {
                    return $.extend({}, params, {
                        pageSize: params.limit,
                        pageNo: parseInt(params.offset / params.limit + 1)
                    })
                },
                sidePagination: "server",
                clickToSelect: true,
                columns: [{
                    checkbox: true
                }, {
                    field: "name",
                    title: "图标库名称",
                    formatter: function (v, rowData) {
                        return "<a data-action='edit'data-id='" + rowData._id + "'>" + v + "</a>";
                    }
                }, {
                    field: "type",
                    title: "图标类型",
                    formatter: function (v) {
                        switch (v) {
                            case 0:
                                return "SVG";
                            case 1:
                                return "PNG";
                        }
                    }
                }, {
                    title: "操作",
                    width: 120,
                    align: "center",
                    formatter: function (v, rowData) {
                        return "<button class='btn btn-sm btn-pure btn-default btn-icon' type='button' title='删除' data-action='del' data-id='" + rowData._id + "'>" +
                            "<i class='glyphicon glyphicon-trash'></i>" +
                            "</button>";
                    }
                }],
                toolbar: "#collectionToolbar",
                pagination: true
            });
        },

        addCollection: function () {

        },

        /**
         * 删除图标库
         */
        delCollection: function (e) {
            var that = this;
            var el = $(e.currentTarget);
            var action = el.data("action");
            var ids = [];
            e.stopPropagation();
            if (action == "batchDel") {
                var selects = this.table.bootstrapTable("getSelections");
                if (!selects.length) {
                    alertify.error("请选择要删除的图标库");
                    return;
                }
                $.each(selects, function () {
                    ids.push(this._id);
                });
            } else {
                ids.push(el.data("id"));
            }
            alertify.confirm("确定删除图标库？", function (e) {
                if (e) {
                    $.ajax({
                        url: window.App.apiIp + "/admin/iconCollection/delIconCollection",
                        method: "post",
                        traditional: true,
                        data: {
                            ids: ids
                        }
                    }).done(function (res) {
                        alertify.success(res.message);
                        if (res.success) {
                            that.table.bootstrapTable("refresh");
                        }
                    })
                }
            });
        },

        /**
         * 编辑图标库
         * @param e
         */
        editCollection: function (e) {
            var el = $(e.currentTarget);
            var collectionId = el.data("id");
            e.stopPropagation();
            window.location.href = "#iconManage/editCollection/" + collectionId;
        },

        validate: function (formData) {
            var $addForm = this.$("#collectionAddForm");
            if (!formData.name) {
                alertify.error("请输入图标库名称");
                $("[name=name]", $addForm).focus();
                return false;
            }
            return true;
        },

        /**
         * 提交表单
         */
        collectionAddSubmit: function () {
            var that = this;
            var formData = this.$("#collectionAddForm").serializeJson();
            if (!this.validate(formData)) return;
            $.ajax({
                url: window.App.apiIp + "/admin/iconCollection/addIconCollection",
                method: "post",
                data: formData
            }).done(function (res) {
                if (res.success) {
                    that.$addModal.bsmodel("hide");
                    that.table.bootstrapTable("refresh");
                    alertify.success("添加成功");
                    alertify.set({labels: {ok: "下一步", cancel: "取消"}});
                    alertify.confirm("添加成功！继续前往上传图标？", function (e) {
                        alertify.set({labels: {ok: "确定", cancel: "取消"}});
                        if (e) {
                            window.location.href = "#iconManage/editCollection/" + res.data._id;
                        }
                    });
                } else {
                    alertify.alert("添加失败，请重试");
                }
            })
        }
    });
});