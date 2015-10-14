define('routes', ['core/router'], function(router) {
    var root = '^/operators';

    router.addRoutes([
        {'pattern': root + '$', 'view_name': 'home'},
        {'pattern': root + '/late-customization$', 'view_name': 'late_customization'},
        {'pattern': root + '/shelves$', 'view_name': 'shelf_listing'},
        {'pattern': root + '/shelves/create$', 'view_name': 'shelf_create'},
        {'pattern': root + '/shelves/edit/([^/<>"\']+)$', 'view_name': 'shelf_edit'},
        {'pattern': root + '/error$', 'view_name': 'error'},
        {'pattern': root + '/unauthorized$', 'view_name': 'unauthorized'},
        {'pattern': root + '/login$', 'view_name': 'login'},
    ]);

    router.api.addRoutes({
        'search': '/api/v2/apps/search/no-region/?cache=1&vary=0',
        'site-config': '/api/v2/services/config/site/?serializer=commonplace',
        'permissions': '/api/v2/account/operators/',
        'feed-shelves': '/api/v2/feed/shelves/',
        'feed-shelves-list': '/api/v2/transonic/feed/shelves/?limit=5',
        'feed-shelf': '/api/v2/feed/shelves/{0}/',
        'feed-shelf-publish': '/api/v2/feed/shelves/{0}/publish/',
        'feed-shelf-mine': '/api/v2/account/shelves/',
        'late-customization': '/api/v2/late-customization/{0}/',
        'late-customizations': '/api/v2/late-customization/',
    });
});
