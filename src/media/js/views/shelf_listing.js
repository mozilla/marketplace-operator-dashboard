define('views/shelf_listing', ['l10n'], function(l10n) {
    var gettext = l10n.gettext;
    return function(builder) {
        builder.z('type', 'shelf_listing');
        builder.z('title', gettext('Operator Shelves'));
        builder.start('shelf_listing.html');
    };
});
