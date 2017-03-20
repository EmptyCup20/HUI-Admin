/**
 * Created by zhengjunling on 2016/12/9.
 */
define(['bsTable'], function () {
    return Backbone.View.extend({
        events: {
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
            })
        },

        /**
         * 初始化表格
         */
        loadTable: function () {
            this.table.bootstrapTable({
                url: window.App.apiIp + "/admin/iconType/getIconCollection",
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
                    alertify.alert("请选择要删除的图标库");
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
                        url: window.App.apiIp + "/admin/iconType/delIconCollection",
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
        }
    });
});