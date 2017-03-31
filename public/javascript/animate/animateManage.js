/**
 * Created by zhengjunling on 2017/3/30.
 */
define(function (require) {
    require('bsTable');
    return Backbone.View.extend({
        events: {
            "click [data-action=del]": "delAnimate",//删除图标库
            "click [data-action=batchDel]": "delAnimate",
            "click [data-action=edit]": "editAnimate"//编辑图标库
        },

        initialize: function () {
            this.render();
        },

        /**
         * 页面初始化
         */
        render: function () {
            var that = this;
            $.get("/html/animate/animateManage.html").done(function (data) {
                $(".page").html(data);

                //定义视图作用域
                that.setElement("#animateManage");

                that.$table = that.$("#animateList");

                that.loadTable();
            })
        },

        /**
         * 初始化表格
         */
        loadTable: function () {
            this.$table.bootstrapTable({
                url: window.App.apiIp + "/admin/animate/getAnimateList",
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
                    title: "标题",
                    formatter: function (v, rowData) {
                        return "<a data-action='edit'data-id='" + rowData._id + "'>" + v + "</a>";
                    }
                }, {
                    field: "attachment_name",
                    title: "附件名称"
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
                toolbar: "#animateToolbar",
                pagination: true
            });
        },

        editAnimate: function (e) {
            var el = $(e.currentTarget);
            var id = el.data("id");
            e.stopPropagation();
            window.location.href = "#animateEdit/" + id;
        },

        delAnimate: function (e) {
            var that = this;
            var el = $(e.currentTarget);
            var action = el.data("action");
            var ids = [];
            e.stopPropagation();
            if (action == "batchDel") {
                var selects = this.$table.bootstrapTable("getSelections");
                if (!selects.length) {
                    alertify.alert("请选择要删除的动效");
                    return;
                }
                $.each(selects, function () {
                    ids.push(this._id);
                });
            } else {
                ids.push(el.data("id"));
            }
            alertify.confirm("确定删除动效？", function (e) {
                if (e) {
                    $.ajax({
                        url: window.App.apiIp + "/admin/animate/delAnimate",
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