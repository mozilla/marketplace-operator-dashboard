define('utils_local', ['jquery', 'notification', 'nunjucks', 'z'],
	function($, notification, nunjucks, z) {

    function build_localized_field(name) {
        var data = {};
        $('.localized[data-name="' + name + '"]').each(function(i, field) {
            if (this.value) {
                data[this.getAttribute('data-lang')] = this.value;
            }
        });
        return data;
    }

    function handle_error(errors) {
        notification.notification({message: gettext('Sorry, we found some errors in the form')});
        render_errors(errors);
    }


    function clear_errors(error) {
        $('.form-errors').empty();
        $('.error-msg').remove();
        $('.has-error').removeClass('has-error');
    }

    function render_errors(errors) {
        clear_errors();

        // Server-side validation returns the raw body of the response as a string.
        if (typeof errors === 'string') {
            errors = JSON.parse(errors);
        }

        // Handle field-specific errors.
        $.each(errors, function(field, message) {
            var $field = $('[data-error-field*="' + field + '"]');
            if ($field.length) {
                var msg = nunjucks.env.render('errors/field_error.html', {
                    message: message
                });
                $field.addClass('has-error').append(msg);
                delete errors[field];
            }
        });

        // Handle form-wide errors.
        if (!$.isEmptyObject(errors)) {
            $('.form-errors').html(nunjucks.env.render('errors/form_errors.html', {
                errors: errors
            }));
        }

        z.win[0].scrollTo(0, 0);
    }

    return {
        build_localized_field: build_localized_field,
        handle_error: handle_error,
        render_errors: render_errors
    };
});
