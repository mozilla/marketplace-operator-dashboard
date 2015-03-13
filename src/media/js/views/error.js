define('views/error',
    ['core/l10n', 'core/urls', 'core/user', 'core/z'],
    function(l10n, urls, user, z) {
    var gettext = l10n.gettext;
    return function(builder) {
        builder.start('errors/http.html');
        builder.z('type', 'error');
        builder.z('title', gettext('Error'));
    };
});
