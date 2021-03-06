define('views/shelf_edit',
    ['core/format', 'core/l10n', 'core/notification', 'core/requests',
     'core/urls', 'core/utils', 'core/user', 'core/z', 'apps/widget', 'fields',
     'forms_local', 'operators', 'utils_local'],
	function(format, l10n, notification, requests,
             urls, utils, user, z, apps_widget, fields,
             forms, operators, utils_local) {
    var gettext = l10n.gettext;

    z.body.on('click', '#shelf-edit .submit button', utils._pd(function(e) {
        var $button = $(this);
        var $form = $button.closest('form');
        $button.data('text', $button.text()).text(gettext('Updating...')).prop('disabled', true);
        $form.find('.form-errors').empty();
        forms.shelf($form, $form.find('#slug').val()).done(function() {
            window.scrollTo(0, 0);
            $button.prop('disabled', false).text($button.data('text'));
            notification.notification({
                message: gettext('Operator shelf successfully updated')
            });
        }).fail(function(error) {
            utils_local.handle_error(error);
            $button.prop('disabled', false).text($button.data('text'));
        });

    }));

    return function(builder, args) {
        var url = urls.api.base.url('feed-shelf', [args[0]]);
        requests.get(url, true).done(function(obj) {

            // Ensure that the shelf being edited belongs to the active operator.
            var current_operator = operators.get.current();
            if (obj.carrier != current_operator.carrier ||
                obj.region != current_operator.region) {
                z.page.trigger('navigate', [urls.reverse('shelf_listing')]);

            } else {
                builder.start('shelf_form.html', {
                    current_operator: current_operator,
                    obj: obj,
                    // L10n: this indicates the name of the operator shelf being edited.
                    title: format.format(gettext('Editing {0}'), obj.slug)
                }).done(function() {
                    fields.highlight_localized();
                    z.page.trigger('refresh_preview');
                    obj.apps.forEach(function(app) {
                        apps_widget.append(app);
                    });
                });
                builder.z('type', 'shelf_form shelf_edit');
                builder.z('title', gettext('Editing'));
            }
        });

    };

});
