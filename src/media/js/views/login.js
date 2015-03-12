define('views/login',
    ['core/l10n', 'core/urls', 'core/user', 'core/z'],
    function(l10n, urls, user, z) {
    var gettext = l10n.gettext;
    return function(builder) {
        if (user.logged_in()) {
            z.page.trigger('divert', [urls.reverse('home')]);
        } else {
            builder.start('login.html');
            builder.z('type', 'leaf login');
            builder.z('title', gettext('Sign in'));
        }
    };
});
