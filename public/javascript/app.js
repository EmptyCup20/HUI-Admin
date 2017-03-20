/**
 * Created by zhengjunling on 2016/12/6.
 */
require.config({
    baseUrl: "/",
    paths: {
        "jquery": "plugins/jquery-1.11.3.min",
        "underscore": "plugins/underscore-min",
        "backbone": "plugins/backbone-min",
        "util": "javascript/util",
        "bootstrap": "plugins/bootstrap/js/bootstrap.min",
        "bsTable": "plugins/bootstrap-table/bootstrap-table",
        "wizard": "plugins/bootstrap-wizard/jquery.bootstrap.wizard",
        "markdown": "plugins/markdown-js/markdown",
        "jquery-ui/widget": "plugins/fileupload/jquery.ui.widget",
        "iframe-transport": "plugins/fileupload/jquery.iframe-transport",
        "fileupload": "plugins/fileupload/jquery.fileupload",
        "alertify": "plugins/alertify/alertify",
        "pace": "plugins/pace/pace"
    },
    //定义依赖
    shim: {
        "util": {
            deps: ["jquery"]
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
        },
        "wizard": {
            deps: ["bootstrap"]
        }
    }
});

require(["require", "backbone", "bootstrap", "util", "alertify", "pace"], function (require) {
    window.alertify = require("alertify");
    window.pace = require("pace");

    function startPace() {
        pace.restart({
            document: false
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
                    //添加图标库
                    "iconManage/addCollection": "collectionAdd",
                    //编辑图标库
                    "iconManage/editCollection/:id": "collectionEdit",
                    "editIcon/:iconId": "editIcon",
                    "editIcon": "editIcon",

                    //UIKIT管理
                    "uikit": "uikitManage",
                    "uikit/uikitEdit/:id": "uikitEdit",

                    //作品池管理
                    "docManage": "docManage",
                    "docManageEdit(/:id)": "docManageEdit",

                    //特殊
                    "*action": "iconCollection"
                },

                iconCollection: function () {
                    startPace();
                    require(["javascript/icon/collectionManage.js"], function (module) {
                        new module;
                    });
                },

                collectionAdd: function () {
                    startPace();
                    require(["javascript/icon/iconCollectionAdd.js"], function (module) {
                        new module();
                    });
                },

                collectionEdit: function (id) {
                    startPace();
                    require(["javascript/icon/iconCollectionEdit.js"], function (module) {
                        new module(id);
                    });
                },

                iconManage: function () {
                    startPace();
                    require(["javascript/icon/iconManage.js"], function (module) {
                        new module;
                    });
                },

                editIcon: function (iconId) {
                    startPace();
                    require(["javascript/icon/editIcon.js"], function (module) {
                        new module(iconId);
                    });
                },

                uikitManage: function () {
                    startPace();
                    require(["javascript/uikit/uikitManage.js"], function (module) {
                        new module;
                    });
                },

                uikitEdit: function (id) {
                    startPace();
                    require(["javascript/uikit/uikitEdit.js"], function (module) {
                        new module(id);
                    });
                },

                docManage: function () {
                    startPace();
                    require(["javascript/doc/docManage.js", "/javascript/base.js"], function (module) {
                        new module;
                    });
                },

                docManageEdit: function (id) {
                    startPace();
                    require(["javascript/doc/docManageEdit.js"], function (module) {
                        new module(id);
                    });
                },
            })
        },
        apiIp: 'http://10.20.134.30:7080'
    };
    new App.Routers.Main();
    Backbone.history.start();
});