define('views/error', ['l10n', 'user', 'urls', 'z'], function(l10n, user, urls, z) {
    var gettext = l10n.gettext;
    return function(builder) {
        builder.start('errors/http.html');
        builder.z('type', 'error');
        builder.z('title', gettext('Error'));
    };
});
