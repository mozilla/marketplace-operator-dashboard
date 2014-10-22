define('views/login', ['l10n', 'user', 'urls', 'z'], function(l10n, user, urls, z) {
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
