/*
    Fetch a list of carrier/region pairs upon which a user has been granted
    object-level permission to operate.
*/

define('permissions', ['defer', 'requests', 'settings', 'underscore', 'urls'],
    function(defer, requests, settings, _, urls) {

    function fetch() {
        var def = defer.Deferred();
        requests.get(urls.api.base.url('permissions')).done(function(data) {
            def.resolve(data);
        });
        return def.promise();
    }

    return {
        'fetch': fetch,
        'promise': fetch(),
    };
});
