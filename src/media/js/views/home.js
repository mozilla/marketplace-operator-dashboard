define('views/home', ['urls', 'z'], function(urls, z) {
	// Eventually there will be a proper homepage here. For now, let's just
	// divert to the opshelf listing page.
    return function(builder) {
        z.page.trigger('divert', [urls.reverse('shelf_listing')]);
    };
});
