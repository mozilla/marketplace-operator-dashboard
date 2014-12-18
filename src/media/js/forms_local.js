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
            background_image_upload_url: $form.find('[data-aviary-type="feed-banner"] .processed-aviary-url').val(),
            background_image_landing_upload_url: $form.find('[data-aviary-type="shelf-landing"] .processed-aviary-url').val(),
            carrier: operator.carrier,
            description: utils_local.build_localized_field('description'),
            name: utils_local.build_localized_field('name'),
            region: operator.region,
            slug: $form.find('[name="slug"]').val(),
        };

        var $preview = $form.find('.fileinput .preview');

        // Validate.
        var errors = validate.shelf(data, $preview);
        if (!$.isEmptyObject(errors)) {
            return defer.Deferred().reject(errors);
        }

        // Sanitize
        data = populate_empty_translations(data, ['description', 'name']);

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

    function get_translated_locales(data, localized_fields) {
        // Iterate over each of the passed localized fields, returning an array
        // containing each language with a translation.
        var locales = [];
        localized_fields.forEach(function(field_name) {
            var field_data = data[field_name];
            $.each(field_data, function(locale, translation) {
                if (!!translation && locales.indexOf(locale) == -1) {
                    locales.push(locale);
                }
            });
        });
        return locales;
    }

    function populate_empty_translations(data, localized_fields) {
        // Santize the passed data by making sure that any locale that has
        // a translation in one of the passed fields has a translation (even if
        // it is an empty string) in each of the passed fields.
        var locales = get_translated_locales(data, localized_fields);
        localized_fields.forEach(function(field_name) {
            locales.forEach(function(locale) {
                if (!(locale in data[field_name])) {
                    data[field_name][locale] = '';
                }
            });
        });
        return data;
    }

    return {
        shelf: shelf
    };
});
