define('fields',
    ['apps/widget', 'aviary', 'core/utils', 'core/z', 'jquery',
     'jquery.fakefilefield', 'underscore'],
    function(apps_widget, aviary, utils, z, $,
             fakefilefield, _) {
    'use strict';

    function updateCharCount() {
        var $this = $(this);
        var charsRemaining = $this.attr('maxlength') - $this.val().length;
        $this.closest('.field').find('.char-count').text(ngettext(
            '{n} character remaining.',
            '{n} characters remaining.',
            {n: charsRemaining}
        ));
    }

    z.page.on('keypress', 'form', function(e) {
        if (e.keyCode == 13) {
            return false;
        }
    })

    // Update preview when things change.
    .on('input change', '[data-name="name"], [data-name="description"]', function() {
        z.page.trigger('refresh_preview');
    })
    .on('refresh_preview', function() {
        // Shelf title
        $('#shelf-preview .title').each(function(i, e) {
            var $title = $(this);
            var $title_input = $('[data-name="name"]:visible');
            $title.text($title_input.val() || $title.data('placeholder'));
        });

        // Shelf description
        var $description = $('#shelf-preview .description');
        var $description_input = $('[data-name="description"]:visible');
        if ($description_input.val()) {
            $description.text($description_input.val()).show();
        } else {
            $description.hide();
        }

        // Update images
        $('.processed-aviary-url').each(function() {
            var $this = $(this);
            var type = $this.closest('.aviary').data('aviary-type');
            var $preview = $('img[data-aviary-type="' + type + '"]');
            $preview.attr('src', $this.val() || $preview.data('placeholder'));
        });
    })

    // Localization of text fields.
    .on('change', '#locale-switcher', function() {
        var lang = this.value;
        $('.localized').addClass('hidden')
                       .filter('[data-lang=' + lang + ']').removeClass('hidden');
        z.page.trigger('refresh_preview');
    })

    .on('input change', '.localized', function() {
        highlight_localized();
    })

    // Image uploads.
    .on('loaded', function() {
        $('.fileinput').fakeFileField();
    })
    .on('change', '.background-image-input [type="file"]', function() {
        var file = this.files[0];
        var preview = $(this).closest('.background-image-input').find('.preview');
        var reader = new FileReader();
        reader.onloadend = function() {
            preview.attr('src', reader.result);
            z.page.trigger('refresh_preview');
        };
        if (file) {
            reader.readAsDataURL(file);
        }
        $(this).closest('.background-image-input').addClass('filled');
    })

    // Prepopulate slug fields.
    .on('input change', '[data-name="name"]', function() {
        var $slug = $('#slug');
        if (!$slug.data('dirty')) {
            $slug.val(utils.slugify($(this).val()));
        }
    })

    // Update character counts where appropriate.
    .on('input change', '[maxlength]', updateCharCount)
    .on('change', '#locale-switcher', function() {
        $('[maxlength]:visible').each(updateCharCount);
    })

    .on('app-selected', function(e, app) {
        apps_widget.append(app);
    });

    // Highlight languages that have been localized.
    function highlight_localized() {
        var localized = $('.localized');
        $('#locale-switcher option').each(function(i, option) {
            var lang = option.value;
            var vals = $.map(localized.filter('[data-lang=' + lang + ']'), function(field) {
                return field.value;
            });
            if (_.any(vals, function(val) { return val; })) {
                option.classList.add('highlighted');
            } else {
                option.classList.remove('highlighted');
            }
        });
    }

    return {
        highlight_localized: highlight_localized
    };
});
