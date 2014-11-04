define('views/shelf_edit', ['apps/widget', 'fields', 'format', 'forms_local', 'l10n', 'notification', 'operators', 'requests', 'user', 'utils', 'utils_local', 'urls', 'z'],
	function(apps_widget, fields, format, forms, l10n, notification, operators, requests, user, utils, utils_local, urls, z) {

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
            builder.start('shelf_form.html', {
                current_operator: operators.get.current(),
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
        });

    };

});
