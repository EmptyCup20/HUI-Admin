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
            })
        }
    });
    return DocManage;
});