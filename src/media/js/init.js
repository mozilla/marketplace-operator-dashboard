define('init',
    ['core/init', 'routes', 'settings_app', 'templates',
     'helpers_local'],
    function(init, routes, settingsApp, templates,
             helpersLocal) {

    return init.ready;
});
