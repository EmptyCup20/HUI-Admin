/**
 * Created by zhengjunling on 2016/12/6.
 */
require.config({
    baseUrl: "/",
    paths: {
        "jquery": "plugins/jquery-1.11.3.min",
        "underscore": "plugins/underscore/underscore-min",
        "backbone": "plugins/backbone-min",
        "util": "javascript/util",
        "base": "javascript/base",
        "bootstrap": "plugins/bootstrap/js/bootstrap",
        "bsTable": "plugins/bootstrap-table/bootstrap-table",
        "markdown": "plugins/markdown-js/markdown",
        "showdown": "plugins/showdown/showdown.min",
        "jquery-ui/widget": "plugins/fileupload/jquery.ui.widget",
        "iframe-transport": "plugins/fileupload/jquery.iframe-transport",
        "fileupload": "plugins/fileupload/jquery.fileupload",
        "alertify": "plugins/alertify/alertify",
        "pace": "plugins/pace/pace",
        "moment": "plugins/moment.min",
        "mdeditor": "plugins/jquery.mdeditor"
    },
    //定义依赖
    shim: {
        "util": {
            deps: ["jquery"]
        },
        "base": {
            deps: ["jquery", "bootstrap", "underscore"]
        },
        "backbone": {
            deps: ["underscore", "jquery"]
        },
        "bootstrap": {
            deps: ["jquery"]
        },
        "bootstrap-table": {
            deps: ["jquery", "bootstrap"]
        },
        "fileupload": {
            deps: ["jquery-ui/widget", "iframe-transport"]
        },
        "bsTable": {
            deps: ["bootstrap"]
        }
    }
});

require(["require", "backbone", "bootstrap", "util", "base", "alertify", "pace"], function (require) {
    window.alertify = require("alertify");
    window.pace = require("pace");

    function startPace() {
        pace.restart({
            document: false
        });
    }

    function viewRender(viewName, modulePath, opts) {
        var view = window.App.Views[viewName];
        startPace();
        view && view.render ? view.render(opts) : require([modulePath], function (module) {
            window.App.Views[viewName] = new module(opts);
        });
    }

    startPace();

    window.App = {
        Routers: {
            //主路由
            Main: Backbone.Router.extend({
                routes: {
                    //图标管理
                    "iconManage": "iconCollection",
                    //编辑图标库
                    "iconManage/editCollection/:id": "collectionEdit",

                    //UIKIT管理
                    "uikit": "uikitModify",

                    //动效资源管理
                    "animateManage": "animateManage",
                    "animateAdd": "animateModify",
                    "animateEdit/:id": "animateModify",

                    //文章管理
                    "articalManage": "articalManage",
                    "articalAdd": "articalModify",
                    "articalModify/:id": "articalModify",

                    /**
                     * 语言设计管理
                     */
                    "designManage": "designManage",
                    "designModify(/:type)": "designModify",

                    "aboutIntro": "aboutIntro",

                    //特殊
                    "*action": "iconCollection"
                },

                iconCollection: function () {
                    viewRender("iconCollectionManage", "javascript/icon/collectionManage");
                },

                collectionEdit: function (id) {
                    viewRender("iconCollectionEdit", "javascript/icon/iconCollectionEdit", {
                        id: id
                    });
                },

                uikitModify: function () {
                    viewRender("uikitModify", "javascript/uikit/uikitModify");
                },

                animateManage: function () {
                    viewRender("animateManage", "javascript/animate/animateManage");
                },

                animateModify: function (id) {
                    viewRender("animateModify", "javascript/animate/animateModify", {
                        id: id
                    });
                },

                articalManage: function () {
                    viewRender("articalManage", "javascript/artical/articalManage");
                },

                articalModify: function (id) {
                    viewRender("articalModify", "javascript/artical/articalModify", {
                        id: id
                    });
                },

                designManage: function () {
                    viewRender("designManage", "javascript/design/designManage");
                },

                designModify: function (type) {
                    viewRender("designModify", "javascript/design/designModify", {
                        type: type
                    });
                },

                aboutIntro: function () {
                    viewRender("aboutEdit", "javascript/about/aboutEdit");
                }
            })
        },
        Views: {},
        apiIp: 'http://10.20.134.30:7080'
    };
    new App.Routers.Main();
    Backbone.history.start();
});