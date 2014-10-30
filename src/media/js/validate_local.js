define('validate_local',
    ['defer', 'jquery', 'l10n', 'underscore', 'utils_local',],
    function(defer, $, l10n, _, utils_local) {
    'use strict';
    var gettext = l10n.gettext;

    var shelf = function(data, $preview) {
        var errs = {};
        if (!data.apps.length) {
            errs.apps = gettext('Apps are required.');
        }
        if (!validate_localized_field(data.name)) {
            errs.name = gettext('Name is required.');
        }
        if (!data.slug) {
            errs.slug = gettext('Slug is required.');
        } else if (!validate_slug(data.slug)) {
            errs.slug = gettext('App is invalid.');
        }
        if (!data.background_image_upload_url) {
            errs['background-image'] = gettext('Valid background image is required.');
        }
        if (!data.background_image_landing_upload_url) {
            errs['background-image-landing'] = gettext('Valid landing background image is required.');
        }
        return errs;
    };

    function validate_localized_field(data) {
        /* Check if l10n object has a value for at least one language. */
        for (var lang in data) {
            if (data[lang].length) {
                return true;
            }
        }
    }

    function validate_slug(slug) {
        if (slug.match(/^[^\/<>"']+$/)) {
            return true;
        }
    }

    return {
        shelf: shelf
    };

});
