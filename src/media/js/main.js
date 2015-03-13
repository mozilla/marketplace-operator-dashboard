console.log('Firefox Marketplace Operator Dashboard');

define('main', ['init'], function() {
require([
    'core/forms',  // Comment this if your app has no forms.
    'core/login',  // Comment this if your app does not have accounts.
    'core/user',  // Comment this if your app does not have accounts.
    'operators',
    'regions',
    'templates',
], function() {
    var logger = require('core/log')('main');
    var operators = require('operators');
    var regions = require('regions');
    var l10n = require('core/l10n');
    var nunjucks = require('core/nunjucks');
    var settings = require('core/settings');
    var storage = require('core/storage');
    var urls = require('core/urls');
    var user = require('core/user');
    var z = require('core/z');

    logger.log('Dependencies resolved, starting init');

    z.body.addClass('html-' + l10n.getDirection());

    // Compile header and footer.
    z.page.on('reload_chrome', function() {
        logger.log('Reloading chrome');
        var all_operators = operators.get.all();
        $('#site-header').html(nunjucks.env.render('header.html', {
            all_operators: all_operators,
            current_operator: operators.get.current(),
            carriers: settings.carriers,
            regions: regions.REGION_CHOICES_SLUG
        })).attr('data-operator-count', all_operators.length);
        $('#site-footer').html(
            nunjucks.env.render('footer.html'));
        z.body.toggleClass('logged-in', user.logged_in());
        z.page.trigger('reloaded_chrome');
    });

    // Redirect to login/unauthorized pages if necessary.
    z.page.on('navigate divert', function(e, url) {
        if (url == urls.reverse('login') ||
            url == urls.reverse('unauthorized') ||
            url.indexOf(urls.reverse('core/fxa_authorize')) !== -1) {
            return;
        } else if (!user.logged_in()) {
            z.page.trigger('navigate', [urls.reverse('login')]);
        } else if (!operators.get.all()) {
            z.page.trigger('navigate', [urls.reverse('unauthorized')]);
        }
    });

    logger.log('Initialization complete');
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
        logger.log('Fetching operator operators');
        operators.fetch().done(function(data) {
            z.page.trigger('navigate', [urls.reverse('home')]);
        }).fail(function(error_view) {
            z.page.trigger('divert', [urls.reverse(error_view)]);
        });
    });
});
});
