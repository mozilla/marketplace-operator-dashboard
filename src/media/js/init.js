define('init',
    ['core/init', 'routes', 'settings_app', 'templates'],
    function(init, routes, settingsApp, templates) {

    return init.ready;
});
