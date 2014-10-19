(function() {

var root = '^/operators';

// Please leave quotes around keys! They're needed for Space Heater.
var routes = window.routes = [
    {'pattern': root + '$', 'view_name': 'home'},
    {'pattern': root + '/login$', 'view_name': 'login'},
];

define('routes', [
    'views/home',
    'views/login',
], function() {
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        route.view = require('views/' + route.view_name);
    }
    return routes;
});

})();
