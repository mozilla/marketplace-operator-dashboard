(function() {

var root = '^/operators';

// Please leave quotes around keys! They're needed for Space Heater.
var routes = window.routes = [
    {'pattern': root + '$', 'view_name': 'home'},
    {'pattern': root + '/shelves$', 'view_name': 'shelf_listing'},
    {'pattern': root + '/error$', 'view_name': 'error'},
    {'pattern': root + '/unauthorized$', 'view_name': 'unauthorized'},
    {'pattern': root + '/login$', 'view_name': 'login'},
];

define('routes', [
    'views/home',
    'views/shelf_listing',
    'views/error',
    'views/unauthorized',
    'views/login',
], function() {
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        route.view = require('views/' + route.view_name);
    }
    return routes;
});
})();
