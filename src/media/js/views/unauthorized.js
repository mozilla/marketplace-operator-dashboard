define('views/unauthorized',
    ['core/l10n', 'core/urls', 'core/user', 'core/z'],
    function(l10n, urls, user, z) {
    var gettext = l10n.gettext;
    return function(builder) {
        builder.start('errors/unauthorized.html');
        builder.z('type', 'unauthorized');
        builder.z('title', gettext('Error'));
    };
});
