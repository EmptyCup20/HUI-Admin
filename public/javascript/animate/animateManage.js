/**
 * Created by zhengjunling on 2017/3/30.
 */
define(function (require) {
    require('bsTable');
    return Backbone.View.extend({
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

                ////初始化表格
                //that.loadTable();
                //
                //var addModalTemp = that.$("#collectionAddModal").html();
                //
                //that.$addModal = that.$("#iconCollectionAdd").bsmodel({
                //    title: "新建图标库",
                //    content: addModalTemp,
                //    ok: "添加"
                //}).on("submit.bs.modal", function () {
                //    that.collectionAddSubmit();
                //});
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
        }
    });
});