define('forms_local',
    ['cache', 'defer', 'jquery', 'log', 'operators', 'requests', 'urls', 'utils_local', 'validate_local'],
    function(cache, defer, $, log, operators, requests, urls, utils_local, validate) {
    'use strict';

    var console = log('forms');

    function get_app_ids($items) {
        // Return a list of app IDs.
        return $.map($items.filter(':not(.app-group)'), function(app) {
            return parseInt(app.getAttribute('data-id'), 10);
        });
    }

    var shelf = function($form, slug) {
        /* Create or update FeedShelf. */
        // Gather data.
        var operator = operators.get.current();
        var data = {
            apps: get_app_ids($('.apps-widget .result')),
            background_image_upload_url: $form.find('section[data-aviary-type="feed-banner"] .processed-aviary-url').val(),
            background_image_landing_upload_url: $form.find('section[data-aviary-type="shelf-landing"] .processed-aviary-url').val(),
            carrier: operator.carrier,
            description: utils_local.build_localized_field('description'),
            name: utils_local.build_localized_field('name'),
            region: operator.region,
            slug: $form.find('[name="slug"]').val(),
        };

        var $preview = $form.find('.fileinput .preview');
        console.log(JSON.stringify(data));

        // Validate.
        var errors = validate.shelf(data, $preview);
        if (!$.isEmptyObject(errors)) {
            return defer.Deferred().reject(errors);
        }

        cache.flush();
        return save_shelf(data, slug);
    };

    function save_shelf(data, slug) {
        var def = defer.Deferred();
        function success(shelf) {
            def.resolve(shelf);
        }
        function fail(xhr) {
            def.reject(xhr.responseText);
        }

        if (slug) {
            // Update.
            requests.put(urls.api.url('feed-shelf', [slug]), data).then(success, fail);
        } else {
            // Create.
            requests.post(urls.api.url('feed-shelves'), data).then(success, fail);
        }

        return def.promise();
    }

    return {
        shelf: shelf
    };
});
