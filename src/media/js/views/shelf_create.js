define('views/shelf_create', ['apps/widget', 'fields', 'forms_local', 'l10n', 'notification', 'operators', 'user', 'utils', 'utils_local', 'urls', 'z'],
	function(apps_widget, fields, forms, l10n, notification, operators, user, utils, utils_local, urls, z) {

    var gettext = l10n.gettext;

    z.body.on('click', '.submit button', utils._pd(function(e) {
        var $button = $(this);
        var $form = $button.closest('form');
        $button.text(gettext('Submitting...')).prop('disabled', true);
        $form.find('.form-errors').empty();

        forms.shelf($form).done(function(feed_element) {
            // z.page.trigger('navigate', [urls.reverse('edit', [feed_type, feed_element.slug])]);
            notification.notification({
                message: gettext('Operator shelf successfully created')
            });
        }).fail(function(error) {
            utils_local.handle_error(error);
            $button.text(gettext('Submit')).prop('disabled', false);
        });

    }));

    return function(builder) {
        builder.start('shelf_create.html', {
        	'current_operator': operators.get.current()
        }).done(function() {
        	fields.highlight_localized();
        });
        builder.z('type', 'shelf_create');
        builder.z('title', gettext('New Operator Shelf'));
    };

});
