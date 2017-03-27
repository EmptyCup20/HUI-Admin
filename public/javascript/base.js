/**
 * Created by zhengjunling on 2016/12/5.
 */


;(function (factory) {
    //模块化
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else factory(jQuery);
})(function ($) {
    //对bootstrap模态框进行封装，方便动态调用
    var BootstrapModel = function (element, options) {
        this.$element = $(element);
        this.$body = $("body");
        this.options = $.extend({}, BootstrapModel.DEFAULT_OPTIONS, options);
        this.isShown = null;
        this.scrollbarWidth = 0;
        this.init();
    };

    BootstrapModel.DEFAULT_OPTIONS = $.extend({}, $.fn.modal.Constructor.DEFAULTS, {
        showHeader: true,
        showFooter: true,
        title: "",
        content: "",
        buttons: [],
        ok: "确定",
        cancel: "取消"
    });

    BootstrapModel.template = '<div class="modal-dialog">' +
        '                       <div class="modal-content">' +
        '                       <% if(showHeader){ %>' +
        '                           <div class="modal-header">' +
        '                               <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
        '                               <h4 class="modal-title"><%= title %></h4>' +
        '                           </div>' +
        '                       <% } %>' +
        '                           <div class="modal-body"><%= content %></div>' +
        '                       <% if(showFooter){ %>' +
        '                           <div class="modal-footer">' +
        '                       <% if(buttons.length){ %>' +
        '                           <% buttons.forEach(function(e){ %>' +
        '                               <button type="button" class="<%= e.className %>"' +
        '                               <% if(e.dismiss){ %> data-dismiss="modal"<% } %>' +
        '                                data-action="<%= e.action %>"><%= e.text %></button>' +
        '                           <% }) %>' +
        '                       <% }else{ %>' +
        '                               <button type="button" class="btn btn-default" data-dismiss="modal"><%= cancel %></button>' +
        '                               <button type="button" class="btn btn-primary" data-action="submit"><%= ok %></button>' +
        '                       <% } %>' +
        '                           </div>' +
        '                       <% } %>' +
        '                       </div>' +
        '                   </div>';

    BootstrapModel.prototype = $.extend({}, $.fn.modal.Constructor.prototype);

    BootstrapModel.prototype.init = function () {
        var _this = this;
        this.$element.addClass("modal fade").attr("role", "dialog");
        this.$element.on("show.bs.modal", $.proxy(this.render, this));
        this.render();
        this.$element.on("click", ".modal-footer [data-action]", function () {
            var action = $(this).data("action");
            var actionEvent = $.Event(action + ".bs.modal", {
                relatedTarget: this
            });
            _this.$element.trigger(actionEvent);
        });
    };

    BootstrapModel.prototype.render = function () {
        this.$element.html(_.template(BootstrapModel.template)(this.options));
    };

    BootstrapModel.prototype.set = function (opts) {
        this.options = $.extend({}, this.options, opts);
        this.render();
    };


    $.fn.bsmodel = function (option) {
        var params = arguments;
        return this.each(function () {
            var $this = $(this),
                data = $this.data('bsmodel'),
                options = 'object' === typeof option && option;
            if (!data) {
                data = new BootstrapModel(this, options);
                $this.data('bsmodel', data);
            }
            if ('string' === typeof option) {
                data[option].apply(data, Array.prototype.slice.call(params, 1));
            }
        });
    };

    $(document).on('click.bs.modal.data-api', '[data-toggle="bsmodal"]', function (e) {
        var $this = $(this);
        var href = $this.attr('href');
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')));
        var option = $target.data('bsmodel') ? 'toggle' : $.extend({remote: !/#/.test(href) && href}, $target.data(), $this.data());

        if ($this.is('a')) e.preventDefault();

        $target.one('show.bs.modal', function (showEvent) {
            if (showEvent.isDefaultPrevented()) return;
            $target.one('hidden.bs.modal', function () {
                $this.is(':visible') && $this.trigger('focus');
            });
        });
        $.fn.bsmodel.call($target, option, this);
    })
});


(function () {
    // 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
})();

