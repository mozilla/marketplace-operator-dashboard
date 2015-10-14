define('forms_local',
    ['apps/widget', 'core/cache', 'core/defer', 'core/log', 'core/requests',
     'core/urls', 'jquery', 'operators', 'underscore', 'utils_local',
     'validate_local'],
    function(apps_widget, cache, defer, log, requests,
             urls, $, operators, _, utils_local,
             validate) {
    'use strict';

    var console = log('forms');

    function get_app_ids($items) {
        // Return a list of app IDs.
        return $.map($items.filter(':not(.app-group)'), function(app) {
            return parseInt(app.getAttribute('data-id'), 10);
        });
    }

    function difference(left, right) {
        return _.reject(left, function(left) {
            return _.some(right, function(right) {
                return right.id === left.id;
            });
        });
    }

    var late_customization = function($form) {
        var $initial_apps = $form.find('[name="initial_apps"]');
        var initial_apps = JSON.parse($initial_apps.val());
        var current_apps = apps_widget.get_apps();
        var deleted_apps = difference(initial_apps, current_apps);
        var created_apps = difference(current_apps, initial_apps);
        return $.when(
            delete_late_customizations(deleted_apps),
            create_late_customizations(created_apps)).then(function() {
                $initial_apps.val(JSON.stringify(apps_widget.get_apps()));
            });
    };

    var delete_late_customizations = function(apps) {
        var deletions = apps.map(function(app) {
            return requests.del(urls.api.url('late-customization',
                                             [app.latecustomization_id]));
        });
        return $.when.apply($, deletions);
    };

    var create_late_customizations = function(apps) {
        var operator = operators.get.current();
        var creations = apps.map(function(app) {
            return requests.post(urls.api.url('late-customizations'), {
                carrier: operator.carrier,
                region: operator.region,
                type: 'webapp',
                app: app.id,
            });
        });
        return $.when.apply($, creations);
    };

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
        late_customization: late_customization,
        shelf: shelf
    };
});
