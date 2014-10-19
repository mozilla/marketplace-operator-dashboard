define('views/home', ['l10n'], function(l10n) {
    var gettext = l10n.gettext;
    return function(builder) {
        builder.start('shelf-listing.html');
        builder.z('type', 'shelf-listing');
        builder.z('title', gettext('Operator Shelves'));
    };
});
