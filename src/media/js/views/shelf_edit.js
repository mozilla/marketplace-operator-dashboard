define('views/shelf_edit', ['apps/widget', 'fields', 'format', 'forms_local', 'l10n', 'notification', 'operators', 'requests', 'user', 'utils', 'utils_local', 'urls', 'z'],
    function(apps_widget, fields, format, forms, l10n, notification, operators, requests, user, utils, utils_local, urls, z) {

    var gettext = l10n.gettext;

    var buttons = {
        'update': gettext('Update'),
        'updating': gettext('Updating...'),
        'delete': gettext('Delete'),
        'deleting': gettext('Deleting...')
    };

    var messages = {
        'updated': gettext('Operator shelf successfully updated'),
        'confirm_delete': gettext('Do you really want to delete this?'),
        'deleted': gettext('Operator shelf successfully deleted')
    };

    z.body.on('click', '#shelf-edit .buttons button.submit', utils._pd(function(e) {
        var $button = $(this);
        var $form = $button.closest('form');
        $button.text(buttons.updating).prop('disabled', true);
        $form.find('.form-errors').empty();
        forms.shelf($form, $form.find('#slug').val()).done(function() {
            window.scrollTo(0, 0);
            $button.text(buttons.update).prop('disabled', false);
            notification.notification({
                message: messages.updated
            });
        }).fail(function(error) {
            utils_local.handle_error(error);
            $button.text(buttons.update).prop('disabled', false);
        });

    }));

    z.body.on('click', '#shelf-edit .buttons button.delete', utils._pd(function(e) {

        var $button = $(this);
        $button.text(buttons.deleting).prop('disabled', true);

        if (!window.confirm(messages.confirm_delete)) {
            $button.text(buttons.delete).prop('disabled', false);
            return;
        }

        var $form = $button.closest('form');
        $form.find('.form-errors').empty();

        var url = urls.api.base.url('feed-shelf', [$form.data('slug')]);
        requests.del(url, true).done(function(obj) {
            z.page.trigger('navigate', [urls.reverse('home')]);
            notification.notification({
                message: messages.deleted
            });
        }).fail(function() {
            utils_local.handle_error(arguments[3]);
            $button.text(buttons.delete).prop('disabled', false);
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
