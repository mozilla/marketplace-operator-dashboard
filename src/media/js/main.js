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
        'operators',
        'settings',
        'templates',
        'user',  // Comment this if your app does not have accounts.
        'z'
    ],
function() {
    var console = require('log')('main');
    var operators = require('operators');
    var settings = require('settings');
    var storage = require('storage');
    var urls = require('urls');
    var user = require('user');
    var z = require('z');

    console.log('Dependencies resolved, starting init');

    z.body.addClass('html-' + require('l10n').getDirection());

    // Compile header and footer.
    z.page.on('reload_chrome', function() {
        console.log('Reloading chrome');
        var nunjucks = require('templates');
        $('#site-header').html(nunjucks.env.render('header.html', {
            all_operators: operators.get.all(),
            current_operator: operators.get.current(),
            carriers: settings.carriers,
            regions: settings.REGION_CHOICES_SLUG
        }));
        $('#site-footer').html(
            nunjucks.env.render('footer.html'));
        z.body.toggleClass('logged-in', require('user').logged_in());
        z.page.trigger('reloaded_chrome');
    });

    // Redirect to login/unauthorized pages if necessary.
    z.page.on('navigate divert', function(e, url) {
        if (url == urls.reverse('login') ||
            url == urls.reverse('unauthorized') ||
            url == urls.reverse('fxa_authorize')) {
            return;
        } else if (!user.logged_in()) {
            z.page.trigger('divert', [urls.reverse('login')]);
        } else if (!operators.get.all()) {
            z.page.trigger('divert', [urls.reverse('unauthorized')]);
        }
    });

    console.log('Initialization complete');
    z.page.trigger('navigate', [window.location.pathname +
                                window.location.search]);
    z.page.trigger('reload_chrome');

    // Show login screen when user logs out.
    z.page.on('logged_out', function() {
        z.body.removeClass('logged-in');
        operators.remove.all();
        z.page.trigger('divert', [urls.reverse('login')]);
    });

    // Fetch operators on login.
    z.page.on('logged_in', function() {
        console.log('Fetching operator operators');
        operators.fetch().done(function(data) {
            z.page.trigger('navigate', [urls.reverse('home')]);
        }).fail(function(error_view) {
            z.page.trigger('divert', [urls.reverse(error_view)]);
        });
    });

});
