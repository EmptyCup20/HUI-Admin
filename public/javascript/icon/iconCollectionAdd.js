/**
 * Created by zhengjunling on 2017/3/16.
 */
define(function () {
    return Backbone.View.extend({
        events: {
            //表单提交
            "click [data-action=submit]": "submit"
        },

        initialize: function () {
            var that = this;
            $.get("/html/icon/iconCollectionAdd.html").done(function (data) {
                $(".page").html(data);
                //定义视图作用域
                that.setElement("#collectionAdd");

                that.form = $("#collectionAddForm");
            });
        },

        validate: function (formData) {
            var that = this;
            if (!formData.name) {
                alertify.alert("请输入名称", function () {
                    that.form.find("[name=name]").focus();
                });
                return false;
            }
            return true;
        },

        /**
         * 提交表单
         */
        submit: function () {
            var formData = this.form.serializeJson();
            if (!this.validate(formData)) return;
            $.ajax({
                url: window.App.apiIp + "/admin/iconType/addIconCollection",
                method: "post",
                data: formData
            }).done(function (res) {
                if (res.success) {
                    alertify.confirm("添加成功，继续前往上传图标？", function (e) {
                        if (e) {
                            window.location.href = "#iconManage/editCollection/" + res.data._id;
                        } else {
                            window.location.href = "#iconManage";
                        }
                    });
                } else {
                    alertify.alert("添加失败，请重试");
                }
            })
        }
    });
});