define('views/late_customization',
    ['apps/widget', 'core/format', 'core/l10n', 'core/notification',
     'core/requests', 'core/urls', 'core/user', 'core/utils', 'core/z',
     'fields', 'forms_local', 'operators', 'utils_local'],
    function(apps_widget, coreFormat, l10n, notification,
             requests, urls, user, utils, z,
             fields, forms, operators, utils_local) {

    var format = coreFormat.format;
    var gettext = l10n.gettext;
    var MAX_APPS = 5;

    z.body.on('click', '#late-customization-form .submit button', utils._pd(function(e) {
        var $button = $(this);
        var $form = $button.closest('form');
        $button.data('text', $button.text()).text(gettext('Saving...')).prop('disabled', true);
        $form.find('.form-errors').empty();

        forms.late_customization($form).done(function() {
            $button.prop('disabled', false).text($button.data('text'));
            notification.notification({
                message: gettext('Late customization set successfully saved')
            });
        }).fail(function(error) {
            utils_local.handle_error(error);
            $button.prop('disabled', false).text($button.data('text'));
        });

    }));

    z.page.on('refresh_preview', function() {
        var $appSelector = $('#app-selector');
        if (!$appSelector.data('full-placeholder')) {
            $appSelector.data(
                'full-placeholder',
                format(gettext('Limit of {count} apps reached.'),
                       {count: MAX_APPS}));
            $appSelector.data('placeholder', $appSelector.attr('placeholder'));
        }
        if (apps_widget.get_apps().length < MAX_APPS) {
            $appSelector
                .attr('placeholder', $appSelector.data('placeholder'))
                .removeAttr('disabled');

        } else {
            $appSelector
                .attr('disabled', 'disabled')
                .attr('placeholder', $appSelector.data('full-placeholder'));
        }
    });

    return function(builder) {
        var operator = operators.get.current();
        requests
            .get(urls.api.url('late-customizations', [], operator))
            .then(function(response) {
                var title = gettext('Late Customization Set');
                builder.start('late_customization.html', {
                    current_operator: operator,
                    title: title,
                    initial_apps: JSON.stringify(response.objects),
                }).done(function() {
                    response.objects.forEach(function(app) {
                        apps_widget.append(app);
                    });
                });
                builder.z('type', 'late_customization');
                builder.z('title', title);
            });
    };

});
