console.log('Sample Commonplace App');

define(
    'main',
    [
        'helpers',  // Must come before mostly everything else.
        'helpers_local',
        'forms',  // Comment this if your app has no forms.
        'l10n',
        'log',
        'login',  // Comment this if your app does not have accounts.
        'navigation',
        'permissions',
        'templates',
        'user',  // Comment this if your app does not have accounts.
        'z'
    ],
function() {
    var console = require('log')('main');
    var permissions = require('permissions');
    var urls = require('urls');
    var user = require('user');
    var z = require('z');

    console.log('Dependencies resolved, starting init');

    z.body.addClass('html-' + require('l10n').getDirection());

    function show_login() {
        z.body.removeClass('logged-in');
        z.page.trigger('divert', [urls.reverse('login')]);
    }

    // Do some last minute template compilation.
    z.page.on('reload_chrome', function() {
        console.log('Reloading chrome');
        var nunjucks = require('templates');
        $('#site-header').html(
            nunjucks.env.render('header.html'));
        $('#site-footer').html(
            nunjucks.env.render('footer.html'));

        z.body.toggleClass('logged-in', require('user').logged_in());
        z.page.trigger('reloaded_chrome');
    }).trigger('reload_chrome');

    // Redirect to login if necessary.
    z.page.on('navigate', function(e, url) {
        if (url == urls.reverse('login')) {
            return;
        }
        if (!user.logged_in()) {
            show_login();
        }
    });

    // Show login screen when user logs out.
    z.page.on('logged_out', function() {
        show_login();
    });

    permissions.promise.done(function(data) {
        console.log('Permissions:', data);
        console.log('Triggering initial navigation');
        z.page.trigger('navigate', [window.location.pathname]);
    });

    console.log('Initialization complete');
});
