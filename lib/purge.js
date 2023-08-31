var cccpurge = require('cccpurge');
var Prismic = require('prismic-javascript');
var { resolve } = require('../components/base');

var REPOSITORY = 'https://unga-klara.cdn.prismic.io/api/v2';

module.exports = purge;

function purge(urls, callback = Function.prototype) {
	if (typeof urls === 'function') {
		callback = urls;
		urls = [];
	}

	cccpurge(
		require('../index'),
		{
			urls: urls,
			resolve: resolveRoute,
			root: `https://${process.env.HOST}`,
			zone: process.env.CLOUDFLARE_ZONE,
			email: process.env.CLOUDFLARE_EMAIL,
			key: process.env.CLOUDFLARE_KEY
		},
		callback
	);
}

function resolveRoute(route, done) {
	switch (route) {
		case '/scen/on-demand': {
			return Prismic.api(REPOSITORY).then(function (api) {
				return api
					.query(Prismic.Predicates.at('document.type', 'page'))
					.then(function (response) {
						done(null, response.results.map(resolve));
					})
					.catch(done);
			});
		}
		case '/scen/:slug': {
			return Prismic.api(REPOSITORY).then(function (api) {
				return api
					.query(Prismic.Predicates.at('document.type', 'event'), { pageSize: 100 })
					.then(function (response) {
						var urls = response.results.map((doc) => `/scen/${doc.uid}`);

						// add event section pages
						urls.push('/scen/kalendarium', '/scen/arkiv', '/scen/on-demand');

						if (response.total_pages === 1) return urls;

						var pages = [];
						for (let i = 2; i <= response.total_pages; i++) {
							pages.push(
								api
									.query(Prismic.Predicates.at('document.type', 'event'), {
										pageSize: 100,
										page: i
									})
									.then(function (response) {
										return response.results.map((doc) => `/scen/${doc.uid}`);
									})
							);
						}

						return Promise.all(pages).then(function (urlsPerPage) {
							return urlsPerPage.reduce((flat, list) => flat.concat(list), urls);
						});
					})
					.then((urls) => done(null, urls))
					.catch(done);
			});
		}
		case '/:slug': {
			return Prismic.api(REPOSITORY).then(function (api) {
				return api
					.query(Prismic.Predicates.at('document.type', 'page'))
					.then(function (response) {
						done(null, response.results.map(resolve));
					})
					.catch(done);
			});
		}
		case '/:slug/:slug': {
			return Prismic.api(REPOSITORY).then(function (api) {
				return api
					.query(Prismic.Predicates.at('document.type', 'page'))
					.then(function (response) {
						done(null, response.results.map(resolve));
					})
					.catch(done);
			});
		}
		case '/pedagoger': {
			return Prismic.api(REPOSITORY).then(function (api) {
				return api
					.query(Prismic.Predicates.at('document.type', 'teachers'))
					.then(function (response) {
						done(null, response.results.map(resolve));
					})
					.catch(done);
			});
		}
		case '/pedagoger/:slug': {
			return Prismic.api(REPOSITORY).then(function (api) {
				return api
					.query(Prismic.Predicates.at('document.type', 'page'))
					.then(function (response) {
						done(null, response.results.map(resolve));
					})
					.catch(done);
			});
		}
		case '/besoket': {
			return Prismic.api(REPOSITORY).then(function (api) {
				return api
					.query(Prismic.Predicates.at('document.type', 'teachers'))
					.then(function (response) {
						done(null, response.results.map(resolve));
					})
					.catch(done);
			});
		}
		case '/besoket/:slug': {
			return Prismic.api(REPOSITORY).then(function (api) {
				return api
					.query(Prismic.Predicates.at('document.type', 'page'))
					.then(function (response) {
						done(null, response.results.map(resolve));
					})
					.catch(done);
			});
		}
		default:
			return done(null);
	}
}
