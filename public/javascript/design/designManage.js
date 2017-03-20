/**
 *
 * @Author zhangxin14
 * @Date   2016/12/9
 *
 */
define(["bsTable"], function (markdown) {
    var DocManage = Backbone.View.extend({
        events: {
            "click [data-action=del]": "delDoc",
        },
        initialize: function () {
            this.render();
        },

        /**
         * 页面初始化
         */
        render: function () {

            var that = this;
            $.get("/html/design/designManage.html").done(function (data) {
                $(".page").html(data);
                that.setElement("#designList");
                that.initTable();

            })
        },

        /**
         * 初始化表格
         */
        initTable: function () {
            $('#designTable').bootstrapTable({
                url: window.App.apiIp + '/admin/design/getDocList',
                queryParams: function (params) {
                    return $.extend(params, {
                        pageSize: 15,
                        pageNumber: 1
                    })
                },
                responseHandler:function(res){
                    return res.rows
                },
                pageNumber: 1,
                pageSize: 13,
                pagination: true,
                columns: [{
                    field: 'name',
                    title: '标题',
                    formatter:function(value){
                        return '<a href="javascript:void(0);">'+value+'</a>'
                    },
                    events: {
                        "click a": function(event,value,row){
                            window.location.href = '#designManageEdit/'+ row._id;
                        }
                    }
                }]
            });
        },
    });
    return DocManage;
});