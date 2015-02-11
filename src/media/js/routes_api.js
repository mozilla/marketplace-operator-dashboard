define('routes_api', [], function() {
    // List API routes here.
    // E.g.:
    // {
    //     "route": "/foo/bar/{0}",
    //     "another_route": "/foo/bar/{0}/asdf"
    // }
    return {
        'fxa-login': '/api/v2/account/fxa-login/',
        'login': '/api/v2/account/login/',
        'logout': '/api/v2/account/logout/',
        'search': '/api/v1/apps/search/suggest/non-public/?cache=1&vary=0',
        'site-config': '/api/v2/services/config/site/?serializer=commonplace',
        'permissions': '/api/v2/account/operators/',
        'feed-shelves': '/api/v2/feed/shelves/',
        'feed-shelves-list': '/api/v2/transonic/feed/shelves/?limit=5',
        'feed-shelf': '/api/v2/feed/shelves/{0}/',
        'feed-shelf-publish': '/api/v2/feed/shelves/{0}/publish/',
        'feed-shelf-mine': '/api/v2/account/shelves/',
    };
});
