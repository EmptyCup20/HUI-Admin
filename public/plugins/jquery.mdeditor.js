/**
 * Created by zhengjunling on 2017/3/30.
 */
define(['showdown', 'fileupload'], function (showdown) {
    'use strict';

    var converter = new showdown.Converter();

    var Mdeditor = function (element) {
        this.$el = $(element);

        this.$el.on("input", ".md-input", $.proxy(this._change, this));

        this.$el.on("blur", ".md-input", $.proxy(this._saveCursorPos, this));

        this.$el.on("click", "[data-action=toggleScreen]", $.proxy(this._setFullscreeen, this));

        this.$el.on("click", "[data-action=submit]", $.proxy(this._submit, this));
    };

    Mdeditor.defaultOptions = {
        //Editor height
        height: 500,

        //Fullscreen control
        fullscreen: true,

        url: null,

        type: "post",

        formData: null,

        uploadUrl: null,

        uploadFieldName: "imgUpload",

        uploadAccept: "png,jpg,jpeg,gif,bmp",

        //Callback for textarea value change
        //change: function (data) {},

        //Callback for valid before submit
        //validate: function (data) {},

        //Callback for submit
        //submit: function (data) {},

        //Callback for successful submit
        //done: function (res) {},

        //Callback for failed submit
        //fail: function (err) {}
    };

    Mdeditor.template = '<div class="md-header btn-toolbar">' +
        '<div class="img-upload pull-left">' +
        '<button class="btn btn-default" type="button"><i class="glyphicon glyphicon-picture"></i></button>' +
        '<input name="<%= uploadFieldName %>" type="file" accept="image/jpeg,image/png,image/gif,image/bmp">' +
        '</div>' +
        '<% if(fullscreen){ %>' +
        '<div class="pull-right">' +
        '<a class="btn btn-default btn-fullscreen" title="全屏" data-action="toggleScreen"><i class="glyphicon glyphicon-resize-full"></i></a>' +
        '<a class="btn btn-default btn-smallscreen" title="窗口" data-action="toggleScreen"><i class="glyphicon glyphicon-resize-small"></i></a>' +
        '</div>' +
        '<% } %>' +
        '</div>' +
        '<div class="md-body clearfix">' +
        '<textarea class="md-input" spellcheck="false" placeholder="请在此输入文本 ..."></textarea>' +
        '<div class="preview-box">' +
        '<span class="placeholder">预览 ...</span>' +
        '</div>' +
        '</div>' +
        '<div class="md-footer">' +
        '<button class="btn btn-success" type="button" data-action="submit">提交修改</button>' +
        '</div>';

    Mdeditor.prototype = {
        _render: function () {
            this.$el.addClass("md-editor").html(_.template(Mdeditor.template)(this.options));
            this.$textField = this.$el.find("textarea");
            this.$uploadField = this.$el.find("input[name=" + this.options.uploadFieldName + "]");
            this._initImgUpload();
            return this;
        },

        setOption: function (opts) {
            this.options = $.extend({}, Mdeditor.defaultOptions, opts);
            this._render();
            return this;
        },

        setValue: function (content) {
            this.$textField.val(content);
            this._change();
        },

        _initImgUpload: function () {
            var that = this;
            this.$uploadField.fileupload({
                url: this.options.uploadUrl,
                formData: {
                    name: this.options.uploadFieldName,
                    type: this.options.uploadAccept
                },
                done: function (t, result) {
                    var res = result.result;
                    if (res.success) {
                        that._insertImgAtCaret(res.data.url);
                        that._change();
                    }
                }
            });
        },

        _saveCursorPos: function () {
            var el = this.$textField.get(0);
            var pos = 0;
            if ('selectionStart' in el) {
                pos = el.selectionStart;
            } else if ('selection' in document) {
                el.focus();
                var r = document.selection.createRange();
                if (r == null) {
                    return 0;
                }
                var re = el.createTextRange(), rc = re.duplicate();
                re.moveToBookmark(r.getBookmark());
                rc.setEndPoint('EndToStart', re);
                return rc.text.length;
            }
            this.$textField.data("cursorPosition", pos);
        },

        _insertImgAtCaret: function (imgUrl) {
            var el = this.$textField.get(0);
            var imgText = "\r\n![](" + imgUrl + ")\r\n";//md图片插入格式
            if (document.selection) { // IE
                var sel = el.createTextRange();
                var cursorPosition = $(el).data("cursorPosition");
                el.focus();
                sel.moveStart('character', cursorPosition);
                sel.collapse();
                sel.select();
                sel.text = imgText;
                $(el).data("cursorPosition", cursorPosition + imgText.length);
                el.focus();
            } else if (el.selectionStart || el.selectionStart == '0') { // 现代浏览器
                var startPos = el.selectionStart, endPos = el.selectionEnd, scrollTop = el.scrollTop;
                el.value = el.value.substring(0, startPos) + imgText + el.value.substring(endPos, el.value.length);
                el.focus();
                el.selectionStart = startPos + imgText.length;
                el.selectionEnd = startPos + imgText.length;
                el.scrollTop = scrollTop;
            } else {
                el.value += imgText;
                el.focus();
            }
        },

        _change: function () {
            if (this.options.change) {
                this.options.change(this.$textField.val());
            }
            this._preview();
        },

        _preview: function () {
            var $previewbox = this.$el.find(".preview-box");
            var md_str = this.$textField.val();
            if (md_str) {
                $previewbox.html(converter.makeHtml(md_str));
            } else {
                $previewbox.html("<span class='placeholder'>预览 ...</span>");
            }
        },

        _setFullscreeen: function () {
            if (this.$el.hasClass("md-fullscreen-mode")) {
                this.$el.removeClass("md-fullscreen-mode");
            } else {
                this.$el.addClass("md-fullscreen-mode");
            }
            return this;
        },

        _submit: function () {
            var p = this.options;
            var content = this.$textField.val();

            if (p.validate && !p.validate(content)) return;

            var formData = $.extend({}, this.options.formData, {
                content: content
            });

            if (p.submit) {
                return p.submit(formData);
            }

            $.ajax({
                url: p.url,
                method: p.type,
                data: formData
            }).done(function (res) {
                p.done && p.done(res);
            }).fail(function (err) {
                p.fail && p.fail(err);
            })
        }
    };

    return Mdeditor;
});