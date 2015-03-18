define('init',
    ['core/init', 'helpers_local', 'routes', 'settings_app', 'templates'],
    function(init, helpersLocal, routes, settingsApp, templates) {

    return init.ready;
});
