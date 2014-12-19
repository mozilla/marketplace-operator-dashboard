/* Configures component and module upgrade paths. */
var config = require('commonplace').config;
var extend = require('node.extend');

var LIB_DEST_PATH = config.LIB_DEST_PATH;

var localConfig = extend(true, {
    bowerConfig: {
        // Bower configuration for which files to get, and where to put them.
        // [Source, excluding bower_components]: [Destination].
        'marketplace-constants/dist/css/regions.styl': 'src/media/css/lib/',
        'marketplace-constants/dist/js/regions.js': config.LIB_DEST_PATH,
        'marketplace-constants/dist/img/regions/*': 'src/media/img/regions/',
    },
    cssBundles: {
        // Arbitrary CSS bundles to create.
        // The key is the bundle name, which'll be excluded from the CSS build.
        // 'main.css': ['src/media/css/base.styl']
    },
    cssExcludes: [
        // List of CSS filenames to exclude from CSS build.
        // splash.styl.css
    ],
    requireConfig: {
        // RequireJS configuration for development, notably files in lib/.
        // [Module name]: [Module path].
        paths: {
            'regions': 'lib/regions',
        },
        shim: {
            // 'underscore': { 'exports': '_' }
        }
    },
    PORT: 8679
}, config);

localConfig.inlineRequireConfig = config.makeInlineRequireConfig(
    localConfig.requireConfig);

module.exports = localConfig;
