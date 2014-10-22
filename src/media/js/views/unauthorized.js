define('views/unauthorized', ['l10n', 'user', 'urls', 'z'], function(l10n, user, urls, z) {
    var gettext = l10n.gettext;
    return function(builder) {
        builder.start('errors/unauthorized.html');
        builder.z('type', 'unauthorized');
        builder.z('title', gettext('Error'));
    };
});
