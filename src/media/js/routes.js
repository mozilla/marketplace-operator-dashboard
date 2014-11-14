(function() {

var root = '^/operators';

// Please leave quotes around keys! They're needed for Space Heater.
var routes = window.routes = [
    {'pattern': root + '$', 'view_name': 'home'},
    {'pattern': root + '/shelves$', 'view_name': 'shelf_listing'},
    {'pattern': root + '/shelves/create$', 'view_name': 'shelf_create'},
    {'pattern': root + '/shelves/edit/([^/<>"\']+)$', 'view_name': 'shelf_edit'},
    {'pattern': root + '/error$', 'view_name': 'error'},
    {'pattern': root + '/unauthorized$', 'view_name': 'unauthorized'},
    {'pattern': root + '/login$', 'view_name': 'login'},
    {'pattern': '^/fxa-authorize$', 'view_name': 'fxa_authorize'},
];

define('routes', [
    'views/home',
    'views/shelf_listing',
    'views/shelf_create',
    'views/shelf_edit',
    'views/error',
    'views/unauthorized',
    'views/login',
    'views/fxa_authorize',
], function() {
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        route.view = require('views/' + route.view_name);
    }
    return routes;
});
})();
