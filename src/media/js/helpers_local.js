define('helpers_local', ['nunjucks', 'operators', 'underscore'],
    function(nunjucks, operators, _) {

    var filters = nunjucks.require('filters');
    var globals = nunjucks.require('globals');

    // Filter operator shelves that do not belong to the current operator.
    filters.for_current = function(shelves) {
        var current = operators.get.current();
        return _.filter(shelves, function(shelf) {

            return (shelf.carrier == current.carrier &&
                    shelf.region == current.region);
        });
    };

    // Filter operator shelves by publication status.
    function by_status(val) {
        return function(shelves) {
            var current = operators.get.current();
            return _.filter(shelves, function(shelf) {
                return shelf.is_published == val;
            });
        };
    }
    filters.active = by_status(true);
    filters.inactive = by_status(false);

    // Functions provided in the default context.
    var helpers = {
    };

    // Put the helpers into the nunjucks global.
    for (var i in helpers) {
        if (helpers.hasOwnProperty(i)) {
            globals[i] = helpers[i];
        }
    }

    return helpers;
});
