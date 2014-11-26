/*
    Handles the retrieval of operators (region/carrier pairs) and selection of
    an active one used by the tool.
*/

define('operators', ['defer', 'jquery', 'nunjucks', 'requests', 'settings', 'storage', 'urls', 'z'],
    function(defer, $, nunjucks, requests, settings, storage, urls, z) {

    var console = require('log')('operators');
    var ALL_OPERATORS_KEY = 'operators_all';
    var CURRENT_OPERATOR_KEY = 'operators_current';

    // Retrieve from localstorage a list of all available operators.
    function getAll() {
        return storage.getItem(ALL_OPERATORS_KEY) || [];
    }

    // Retrieve from localstorage the currently-selected operator.
    function getCurrent() {
        return storage.getItem(CURRENT_OPERATOR_KEY) || null;
    }

    // Store in localstorage the full list of available operators.
    function setAll(data) {
        console.log('Storing operators', data);
        storage.setItem(ALL_OPERATORS_KEY, data);
    }

    // Store in localstorage the currently-selected operator.
    function setCurrent(carrier, region) {
        console.log('Setting current operator', carrier, region);
        storage.setItem(CURRENT_OPERATOR_KEY, {
            carrier: carrier,
            region: region
        });
        z.body.removeClass('show-operator_selection');
        z.page.trigger('reload_chrome').trigger('divert', [window.location.pathname]);
    }

    // Remove from localstorage all operators.
    function removeAll() {
        console.log('Removing all operators');
        removeCurrent();
        storage.removeItem(ALL_OPERATORS_KEY);
    }

    // Remove from localstorage the currently-selected operator.
    function removeCurrent() {
        console.log('Removing current operator');
        storage.removeItem(CURRENT_OPERATOR_KEY);
    }

    function fetch() {
        var def = defer.Deferred();
        requests.get(urls.api.url('permissions')).done(function(data) {
            var operators;

            if (data[0] == '*') {
                operators = [];
                $.each(settings.carriers, function(i, carrier) {
                    $.each(Object.keys(settings.REGION_CHOICES_SLUG), function(i, region) {
                        operators.push({
                            'carrier': carrier,
                            'region': region
                        });
                    });
                });

            } else {
                operators = data.objects;
            }

            console.log('Received operators from server', operators);
            setAll(operators);

            // If the user has no operators, ship em off.
            // TODO: if the user has OperatorDashboard:*, bypass this.
            if (!operators.length) {
                console.warn('User has no operators.');
                removeCurrent();
                def.reject('unauthorized');
                return;
            }

            // Set the current operator to the first available, for the sake of
            // having one selected.
            if (!getCurrent() && operators.length) {
                setCurrent(operators[0].carrier, operators[0].region);
            }

            z.page.trigger('reload_chrome');
            def.resolve(data);

        }).fail(function(data) {
            def.reject('error');
        });

        return def.promise();
    }

    // Toggle visibility of operator selection form.
    z.body.on('click', '#current_operator', function(evt) {
        z.body.toggleClass('show-operator_selection');
        $('#operator_selection select').focus();

    // Handle submission of the operator selection form.
    }).on('submit', '#operator_selection form', function(evt) {
        evt.preventDefault();
        var region = $('#operator_selection option[data-region]:selected').data('region');
        var carrier = $('#operator_selection option[data-carrier]:selected').data('carrier');
        if (carrier && region) {
            setCurrent(carrier, region);
        } else {
            z.body.removeClass('show-operator_selection');
        }
    });

    return {
        remove: {
            all: removeAll,
            current: removeCurrent
        },
        get: {
            all: getAll,
            current: getCurrent
        },
        set: {
            all: setAll,
            current: setCurrent
        },
        fetch: fetch
    };

});
