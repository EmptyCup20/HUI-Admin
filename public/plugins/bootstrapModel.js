/**
 * Created by zhengjunling on 2017/4/11.
 */
;(function (factory) {
    //模块化
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'bootstrap'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'), require('bootstrap'));
    } else factory(jQuery);
})(function ($, bootstrap) {
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