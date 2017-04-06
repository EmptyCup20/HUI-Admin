/**
 * Created by zhengjunling on 2017/3/30.
 */
define(function (require) {
    require('bsTable');
    var moment = require("moment");
    return Backbone.View.extend({
        events: {
            "click [data-action=del]": "del",//删除图标库
            "click [data-action=batchDel]": "del",
            "click [data-action=modify]": "modify"//编辑图标库
        },

        initialize: function () {
            this.render();
        },

        /**
         * 页面初始化
         */
        render: function () {
            var that = this;
            $.get("/html/artical/articalManage.html").done(function (data) {
                $(".page").html(data);

                //定义视图作用域
                that.setElement("#articalManage");

                that.$table = that.$("#articalList");

                that.loadTable();
            })
        },

        /**
         * 初始化表格
         */
        loadTable: function () {
            this.$table.bootstrapTable({
                url: window.App.apiIp + "/admin/artical/getArticalList",
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
                    field: "title",
                    title: "文章标题",
                    formatter: function (v, rowData) {
                        return "<a data-action='modify'data-id='" + rowData._id + "'>" + v + "</a>";
                    }
                }, {
                    field: "create_at",
                    title: "发布日期",
                    formatter: function (v) {
                        return moment(v).format('YYYY-MM-DD HH:mm:ss');
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
                pagination: true
            });
        },

        modify: function (e) {
            var el = $(e.currentTarget);
            var id = el.data("id");
            e.stopPropagation();
            window.location.href = "#articalManage/modify/" + id;
        },

        del: function (e) {
            var that = this;
            var el = $(e.currentTarget);
            var action = el.data("action");
            var ids = [];
            e.stopPropagation();
            if (action == "batchDel") {
                var selects = this.$table.bootstrapTable("getSelections");
                if (!selects.length) {
                    alertify.error("请选择要删除的文章");
                    return;
                }
                $.each(selects, function () {
                    ids.push(this._id);
                });
            } else {
                ids.push(el.data("id"));
            }
            alertify.confirm("确定删除文章？", function (e) {
                if (e) {
                    $.ajax({
                        url: window.App.apiIp + "/admin/artical/del",
                        method: "post",
                        traditional: true,
                        data: {
                            ids: ids
                        }
                    }).done(function (res) {
                        alertify.success(res.message);
                        if (res.success) {
                            that.$table.bootstrapTable("refresh");
                        }
                    })
                }
            });
        }
    });
});