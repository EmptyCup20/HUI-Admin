if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

// Include all our dependencies and return the resulting library.

define(['plugins/markdown-js/parser',
    'plugins/markdown-js/markdown_helpers',
    'plugins/markdown-js/render_tree',
    'plugins/markdown-js/dialects/gruber',
    'plugins/markdown-js/dialects/maruku'], function (Markdown) {
    return Markdown;
});
